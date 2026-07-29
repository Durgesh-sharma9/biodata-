import dns from 'dns';
import dnsPromises from 'dns/promises';
import https from 'https';

function queryDoH(name, type) {
  return new Promise((resolve, reject) => {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Keep copies of original functions
const originalResolveSrv = dnsPromises.resolveSrv;
const originalResolveTxt = dnsPromises.resolveTxt;
const originalLookup = dnsPromises.lookup;

const resolveSrvPatch = async function(hostname) {
  try {
    return await originalResolveSrv.call(this, hostname);
  } catch (err) {
    if (err.code === 'ESERVFAIL' || err.code === 'ENOTFOUND' || err.code === 'EREFUSED') {
      const dohRes = await queryDoH(hostname, 'SRV');
      if (dohRes.Answer) {
        return dohRes.Answer.map(ans => {
          const parts = ans.data.split(' ');
          return {
            priority: parseInt(parts[0], 10),
            weight: parseInt(parts[1], 10),
            port: parseInt(parts[2], 10),
            name: parts[3].replace(/\.$/, '')
          };
        });
      }
    }
    throw err;
  }
};

const resolveTxtPatch = async function(hostname) {
  try {
    return await originalResolveTxt.call(this, hostname);
  } catch (err) {
    if (err.code === 'ESERVFAIL' || err.code === 'ENOTFOUND' || err.code === 'EREFUSED') {
      const dohRes = await queryDoH(hostname, 'TXT');
      if (dohRes.Answer) {
        return dohRes.Answer.map(ans => {
          const cleanData = ans.data.replace(/^"|"$/g, '');
          return [cleanData];
        });
      }
    }
    throw err;
  }
};

const lookupPatch = async function(hostname, options) {
  try {
    return await originalLookup.call(this, hostname, options);
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ESERVFAIL' || err.code === 'EREFUSED') {
      const dohRes = await queryDoH(hostname, 'A');
      if (dohRes.Answer) {
        const aRecord = dohRes.Answer.find(ans => ans.type === 1);
        if (aRecord) {
          const ip = aRecord.data;
          if (options && options.all) {
            return [{ address: ip, family: 4 }];
          }
          return { address: ip, family: 4 };
        }
      }
    }
    throw err;
  }
};

// Patch both imports
dnsPromises.resolveSrv = resolveSrvPatch;
dnsPromises.resolveTxt = resolveTxtPatch;
dnsPromises.lookup = lookupPatch;

if (dns.promises) {
  dns.promises.resolveSrv = resolveSrvPatch;
  dns.promises.resolveTxt = resolveTxtPatch;
  dns.promises.lookup = lookupPatch;
}

// Callback based dns.lookup
const originalCallbackLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  originalCallbackLookup(hostname, options, async (err, address, family) => {
    if (err && (err.code === 'ENOTFOUND' || err.code === 'ESERVFAIL' || err.code === 'EREFUSED')) {
      try {
        const dohRes = await queryDoH(hostname, 'A');
        if (dohRes.Answer) {
          const aRecord = dohRes.Answer.find(ans => ans.type === 1);
          if (aRecord) {
            const ip = aRecord.data;
            return callback(null, ip, 4);
          }
        }
      } catch (dohErr) {
        return callback(err);
      }
    }
    callback(err, address, family);
  });
};
