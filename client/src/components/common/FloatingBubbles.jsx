import { useEffect, useRef } from "react";
const BUBBLES = [
  { id:1, size:110, c1:"#8b5cf699", c2:"#a855f755", blur:16 },
  { id:2, size:88,  c1:"#38bdf899", c2:"#67e8f955", blur:14 },
  { id:3, size:105, c1:"#34d39999", c2:"#5eead455", blur:15 },
  { id:4, size:90,  c1:"#fbbf2499", c2:"#fb923c55", blur:14 },
  { id:5, size:72,  c1:"#e879f999", c2:"#f472b655", blur:12 },
  { id:6, size:118, c1:"#6366f199", c2:"#60a5fa55", blur:18 },
  { id:7, size:100, c1:"#fb718599", c2:"#f9a8d455", blur:15 },
];
function rand(a,b){return Math.random()*(b-a)+a;}
export default function FloatingBubbles(){
  const refs=useRef([]);
  useEffect(()=>{
    const ts=[];
    refs.current.forEach((el,i)=>{
      if(!el)return;
      el.style.left=rand(3,85)+"vw";
      el.style.top=rand(3,85)+"vh";
      function go(){
        if(!el)return;
        const dur=rand(5000,10000);
        el.style.transition="left "+dur+"ms cubic-bezier(0.4,0,0.6,1), top "+dur+"ms cubic-bezier(0.4,0,0.6,1)";
        el.style.left=rand(3,85)+"vw";
        el.style.top=rand(3,85)+"vh";
        ts.push(setTimeout(go,dur+rand(300,1200)));
      }
      ts.push(setTimeout(go,i*700+rand(0,500)));
    });
    return ()=>ts.forEach(clearTimeout);
  },[]);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFBFC]" aria-hidden="true">
      {BUBBLES.map((b,i)=>(
        <div key={b.id} ref={(el)=>(refs.current[i]=el)} style={{position:"absolute",width:b.size,height:b.size,borderRadius:"50%",background:"radial-gradient(circle at 40% 40%, "+b.c1+", "+b.c2+")",filter:"blur("+b.blur+"px)"}} />
      ))}
    </div>
  );
}
