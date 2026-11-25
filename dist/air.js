export const categories = [
 {max:50,name:'Good',color:'#699c70',headline:'A good day to get outside.',summary:'Air quality is satisfactory. Enjoy your usual outdoor activities.'},
 {max:100,name:'Moderate',color:'#c0a34d',headline:'A little awareness goes a long way.',summary:'Air quality is acceptable. Unusually sensitive people may want to ease prolonged outdoor exertion.'},
 {max:150,name:'Unhealthy for sensitive groups',color:'#cf8953',headline:'Take a gentler pace outside.',summary:'Sensitive groups should reduce prolonged or heavy outdoor exertion.'},
 {max:200,name:'Unhealthy',color:'#cc6662',headline:'Make it an indoor kind of day.',summary:'Everyone should reduce prolonged or heavy outdoor exertion; sensitive groups should avoid it.'},
 {max:300,name:'Very unhealthy',color:'#9875a5',headline:'Keep outdoor activity limited.',summary:'Everyone should avoid prolonged or heavy outdoor exertion. Sensitive groups should avoid outdoor exertion.'},
 {max:Infinity,name:'Hazardous',color:'#8e5367',headline:'Stay indoors where possible.',summary:'Everyone should avoid outdoor exertion and follow local public health advisories.'}
];
export function category(value){return Number.isFinite(value)&&value>=0?categories.find(c=>value<=c.max):null;}
export function forecastWindow(hours,duration=1){
 let best=null;
 for(let i=0;i<=hours.length-duration;i++){
  const window=hours.slice(i,i+duration);
  if(window.some((h,j)=>!Number.isFinite(h.aqi)||h.aqi<0||(j&&h.time-window[j-1].time!==3600)))continue;
  const average=window.reduce((s,h)=>s+h.aqi,0)/duration;
  if(!best||average<best.average)best={time:window[0].time,end:window.at(-1).time+3600,average,peak:Math.max(...window.map(h=>h.aqi))};
 }
 return best;
}
export function demoData(){
 const start=Math.floor(Date.now()/3600000)*3600;
 const values=[64,67,71,78,83,80,76,69,61,54,48,44,42,46,51,58,65,73,79,81,77,70,65,62];
 return {current:{us_aqi:64,pm2_5:17.4,pm10:32.8,nitrogen_dioxide:12.6,ozone:58.2,sulphur_dioxide:4.1,carbon_monoxide:215,time:start},hours:values.map((aqi,i)=>({aqi,time:start+i*3600})),timezone:'Asia/Kolkata'};
}
