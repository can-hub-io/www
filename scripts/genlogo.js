const fs=require('fs');
const BRAND="#0b6e3a", WHITE="#ffffff", r2=n=>(+n).toFixed(2);
const hexPts=(cx,cy,s)=>{let p=[];for(let i=0;i<6;i++){const a=(-90+60*i)*Math.PI/180;p.push(r2(cx+s*Math.cos(a))+","+r2(cy+s*Math.sin(a)));}return p.join(" ");};
const vert=(cx,cy,R,i)=>{const a=(-90+60*i)*Math.PI/180;return [cx+R*Math.cos(a), cy+R*Math.sin(a)];};
const pol=(cx,cy,rad,deg)=>{const a=deg*Math.PI/180;return [cx+rad*Math.cos(a), cy+rad*Math.sin(a)];};
const hub=(cx,cy,R)=>`  <polygon points="${hexPts(cx,cy,R)}" fill="${WHITE}" stroke="${BRAND}" stroke-width="4.2" stroke-linejoin="round"/>
  <polygon points="${hexPts(cx,cy,R*0.58)}" fill="${BRAND}"/>
  <circle cx="${cx}" cy="${cy}" r="${r2(R*0.16)}" fill="${WHITE}"/>`;
const P=(x,y)=>`${r2(x)} ${r2(y)}`;
const pen=w=>`fill="none" stroke="${BRAND}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const line=(a,b,w)=>`<path d="M${P(a[0],a[1])} L${P(b[0],b[1])}" ${pen(w)}/>`;
const fillAttr=f=>f?`fill="${BRAND}"`:`fill="${WHITE}" stroke="${BRAND}" stroke-width="2.1"`;
function shp(k,cx,cy,f,s){switch(k){
  case 'square':return `<rect x="${r2(cx-s*0.86)}" y="${r2(cy-s*0.86)}" width="${r2(s*1.72)}" height="${r2(s*1.72)}" rx="${r2(s*0.27)}" ${fillAttr(f)}/>`;
  case 'round': return `<rect x="${r2(cx-s*0.9)}" y="${r2(cy-s*0.9)}" width="${r2(s*1.8)}" height="${r2(s*1.8)}" rx="${r2(s*0.66)}" ${fillAttr(f)}/>`;
  case 'dot':   return `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(s*0.9)}" ${fillAttr(f)}/>`;
  case 'via':   return `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(s*0.92)}" fill="${WHITE}" stroke="${BRAND}" stroke-width="2.0"/><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(s*0.36)}" fill="${BRAND}"/>`;
  case 'hex':   return `<polygon points="${hexPts(cx,cy,s)}" ${fillAttr(f)} stroke-linejoin="round"/>`;
  case 'diam':  return `<polygon points="${r2(cx)},${r2(cy-s*1.15)} ${r2(cx+s*1.15)},${r2(cy)} ${r2(cx)},${r2(cy+s*1.15)} ${r2(cx-s*1.15)},${r2(cy)}" ${fillAttr(f)} stroke-linejoin="round"/>`;
  case 'tri':   return `<polygon points="${r2(cx)},${r2(cy-s*1.1)} ${r2(cx+s*1.04)},${r2(cy+s*0.86)} ${r2(cx-s*1.04)},${r2(cy+s*0.86)}" ${fillAttr(f)} stroke-linejoin="round"/>`;
}}
const AGSHAPE=['square','hex','diam','round','hex','square'];
const IFACE=['tri','square','dot','diam','via','hex','round'];
const CLIENT=['dot','diam','square','tri','hex','via'];
const F='fork',S='single';
function buildInner(R,pattern,seed){
  const cx=50,cy=50, Rj=R+11, Rout=R+21, fork=11;
  let tr="",nd="",ki=0,kc=0;
  for(let i=0;i<6;i++){
    if(pattern[i]==='fork'){
      const o=vert(cx,cy,R,i), base=-90+60*i, j=pol(cx,cy,Rj,base);
      const lA=pol(cx,cy,Rout,base-fork), lB=pol(cx,cy,Rout,base+fork);
      tr+=line(o,j,2.6)+line(j,lA,2.2)+line(j,lB,2.2);
      nd+=shp(AGSHAPE[i],j[0],j[1],1,4.4);
      nd+=shp(IFACE[(ki+seed)%IFACE.length],lA[0],lA[1],1,3.1); ki++;
      nd+=shp(IFACE[(ki+seed)%IFACE.length],lB[0],lB[1],1,3.1); ki++;
    } else {
      const o=vert(cx,cy,R,i), base=-90+60*i, n=pol(cx,cy,Rout,base);
      tr+=line(o,n,2.6);
      nd+=shp(CLIENT[(kc+seed)%CLIENT.length],n[0],n[1],0,4.4); kc++;
    }
  }
  return `${tr}\n  ${nd}\n${hub(cx,cy,R)}`;
}
const PAT2=[F,S,F,S,F,S];
const inner=buildInner(20,PAT2,1);

// logo.svg
const logo=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="can-hub">
  ${inner}
</svg>
`;
fs.writeFileSync('static/logo.svg',logo);

// favicon.svg — concentric hub alone, large
const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="can-hub">
${hub(50,50,40)}
</svg>
`;
fs.writeFileSync('static/favicon.svg',fav);

// og.svg — 1200x630 social card
const og=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="can-hub">
  <defs>
    <radialGradient id="glow" cx="22%" cy="26%" r="60%">
      <stop offset="0" stop-color="#d8f0e4"/>
      <stop offset="1" stop-color="#fbfdfb"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(120,135) scale(3.6)">
${inner}
  </g>
  <g font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif">
    <text x="560" y="300" font-size="104" font-weight="700" letter-spacing="-3" fill="#14201a">can<tspan fill="#0b6e3a">·</tspan>hub</text>
    <text x="563" y="372" font-size="35" fill="#5b6b62">CAN bus over the network, done right.</text>
    <text x="563" y="430" font-size="26" fill="#0b6e3a" font-weight="600">can-hub.io</text>
  </g>
</svg>
`;
fs.writeFileSync('static/og.svg',og);
console.log("wrote static/logo.svg, static/favicon.svg, static/og.svg");
