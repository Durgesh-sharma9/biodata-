import { useEffect, useRef } from "react";
const DEFAULT_BUBBLES = [
  { id:1, size:110, c1:"#8b5cf699", c2:"#a855f755", blur:16 },
  { id:2, size:88,  c1:"#38bdf899", c2:"#67e8f955", blur:14 },
  { id:3, size:105, c1:"#34d39999", c2:"#5eead455", blur:15 },
  { id:4, size:90,  c1:"#fbbf2499", c2:"#fb923c55", blur:14 },
  { id:5, size:72,  c1:"#e879f999", c2:"#f472b655", blur:12 },
  { id:6, size:118, c1:"#6366f199", c2:"#60a5fa55", blur:18 },
  { id:7, size:100, c1:"#fb718599", c2:"#f9a8d455", blur:15 },
];

const EMBEDDED_BUBBLES = [
  { id:1, size:140, c1:"#8b5cf6aa", c2:"#a855f766", blur:20 },
  { id:2, size:120, c1:"#38bdf8aa", c2:"#06b6d466", blur:18 },
  { id:3, size:135, c1:"#10b981aa", c2:"#14b8a666", blur:20 },
  { id:4, size:115, c1:"#f59e0baa", c2:"#fb923c66", blur:18 },
  { id:5, size:150, c1:"#ec4899aa", c2:"#f43f5e66", blur:22 },
  { id:6, size:165, c1:"#6366f1aa", c2:"#8b5cf666", blur:24 },
  { id:7, size:125, c1:"#06b6d4aa", c2:"#3b82f666", blur:18 },
  { id:8, size:110, c1:"#a855f7aa", c2:"#d946ef66", blur:16 },
  { id:9, size:130, c1:"#3b82f6aa", c2:"#60a5fa66", blur:20 },
];

function rand(a,b){return Math.random()*(b-a)+a;}

export default function FloatingBubbles({ embedded = false }){
  const refs=useRef([]);
  const bubbles = embedded ? EMBEDDED_BUBBLES : DEFAULT_BUBBLES;

  useEffect(()=>{
    const ts=[];
    const unitX = embedded ? "%" : "vw";
    const unitY = embedded ? "%" : "vh";
    const minX = embedded ? -8 : 3;
    const maxX = embedded ? 80 : 85;
    const minY = embedded ? -8 : 3;
    const maxY = embedded ? 82 : 85;

    refs.current.forEach((el,i)=>{
      if(!el)return;
      // Set initial random coordinate
      el.style.left=rand(minX,maxX)+unitX;
      el.style.top=rand(minY,maxY)+unitY;

      function go(){
        if(!el)return;
        const dur=rand(4500,8500);
        el.style.transition="left "+dur+"ms cubic-bezier(0.4,0,0.6,1), top "+dur+"ms cubic-bezier(0.4,0,0.6,1)";
        el.style.left=rand(minX,maxX)+unitX;
        el.style.top=rand(minY,maxY)+unitY;
        ts.push(setTimeout(go,dur+rand(50,300)));
      }

      // Start movement immediately with brief stagger
      ts.push(setTimeout(go,i*150+50));
    });
    return ()=>ts.forEach(clearTimeout);
  },[embedded]);

  return (
    <div 
      className={`${embedded ? "absolute" : "fixed"} inset-0 pointer-events-none z-0 overflow-hidden ${embedded ? "" : "bg-[#FAFBFC]"}`} 
      aria-hidden="true"
    >
      {bubbles.map((b,i)=>(
        <div 
          key={b.id} 
          ref={(el)=>(refs.current[i]=el)} 
          style={{
            position:"absolute",
            width:b.size,
            height:b.size,
            borderRadius:"50%",
            background:"radial-gradient(circle at 40% 40%, "+b.c1+", "+b.c2+")",
            filter:"blur("+b.blur+"px)"
          }} 
        />
      ))}
    </div>
  );
}
