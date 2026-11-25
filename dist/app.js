import {categories,category,forecastWindow,demoData} from './air.js';
const $=id=>document.getElementById(id);
const defaults={name:'Chennai',country:'India',latitude:13.0827,longitude:80.2707};
let place=defaults,data=null,isDemo=false,requestId=0,searchId=0;
let saved=[];try{saved=JSON.parse(localStorage.getItem('urban-air-places')||'[]');if(!Array.isArray(saved))saved=[];saved=saved.filter(p=>typeof p.name==='string'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)).slice(0,6);}catch{}
const pollutants=[['pm2_5','PM₂.₅','Fine particles'],['pm10','PM₁₀','Coarse particles'],['nitrogen_dioxide','NO₂','Nitrogen dioxide'],['ozone','O₃','Ozone'],['sulphur_dioxide','SO₂','Sulphur dioxide'],['carbon_monoxide','CO','Carbon monoxide']];
const number=n=>Number.isFinite(n)?Math.round(n*10)/10:'—';
function label(p){return [p.name,p.admin1,p.country].filter((s,i,a)=>s&&a.indexOf(s)===i).join(', ');}
function time(t,options={}){return new Intl.DateTimeFormat('en',{timeZone:data?.timezone||'UTC',hour:'numeric',minute:'2-digit',...options}).format(new Date(t*1000));}
function notice(text){$('message').textContent=text;}
async function json(url){const response=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error(`Service returned ${response.status}`);return response.json();}
function renderSaved(){
 $('saved').replaceChildren();
 if(!saved.length){const p=document.createElement('p');p.textContent='Save a city for a quicker check-in.';$('saved').append(p);}
 saved.forEach(p=>{const b=document.createElement('button');b.textContent='⌖  '+p.name;b.title=label(p);b.onclick=()=>load(p);$('saved').append(b);});
 $('save').textContent=saved.some(p=>p.latitude===place.latitude&&p.longitude===place.longitude)?'★ Saved place':'☆ Save place';
}
function render(){
 const current=data?.current||{};const c=category(current.us_aqi);
 $('city').textContent=label(place);$('data-badge').textContent=isDemo?'Demo data':'Model forecast';
 $('updated').textContent=(isDemo?'Illustrative sample · ':'Forecast valid ')+(current.time?time(current.time,{month:'short',day:'numeric'}):'time unavailable')+' · '+(data?.timezone||'UTC');
 $('aqi').textContent=Number.isFinite(current.us_aqi)?Math.round(current.us_aqi):'—';
 $('gauge').style.setProperty('--accent',c?.color||'#9aa69b');$('category').textContent=c?.name||'Unavailable';$('headline').textContent=c?.headline||'Current AQI is unavailable.';$('summary').textContent=c?.summary||'Try another city or check again later.';
 $('pollutant-grid').replaceChildren();
 pollutants.forEach(([key,symbol,name])=>{const card=document.createElement('div');card.className='pollutant';card.innerHTML=`<span class="symbol">${symbol}</span><span class="poll-name">${name}</span><strong>${number(current[key])}</strong><span class="unit">µg/m³</span>`;$('pollutant-grid').append(card);});
 const best=forecastWindow(data?.hours||[]);
 $('best-time').textContent=best?time(best.time,{weekday:'short'}):'Not available';$('best-aqi').textContent=best?`AQI ${Math.round(best.average)} · ${category(best.average)?.name}`:'No forecast window available';
 $('best-summary').textContent=best?`The lowest forecast value in the next 24 hours is ${Math.round(best.average)}. Check again before heading out.`:'Hourly forecasts are temporarily unavailable.';
 drawChart();renderPlan();renderSaved();
}
function drawChart(){
 const hours=data?.hours||[];const valid=hours.filter(h=>Number.isFinite(h.aqi)&&h.aqi>=0);
 if(!valid.length){$('chart').textContent='No hourly forecast is available.';return;}
 const max=Math.max(100,Math.ceil(Math.max(...valid.map(h=>h.aqi))/50)*50),w=620,h=210,left=40,right=12,top=20,bottom=35;
 const x=i=>left+i*(w-left-right)/Math.max(1,hours.length-1);const y=v=>top+(max-v)/max*(h-top-bottom);
 let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Hourly US AQI forecast; lower values mean lower air pollution"><title>Next 24 hours US AQI</title>`;
 for(let i=0;i<=4;i++){let v=max*i/4;svg+=`<path d="M${left} ${y(v)}H${w-right}" stroke="#edf1ec"/><text x="${left-10}" y="${y(v)+4}" text-anchor="end" fill="#8b988d" font-size="11">${Math.round(v)}</text>`;}
 let path='',segment=false;
 hours.forEach((v,i)=>{if(!Number.isFinite(v.aqi)||v.aqi<0){segment=false;return;}path+=`${segment?'L':'M'}${x(i)},${y(v.aqi)} `;segment=true;});
 svg+=`<path d="${path}" stroke="#6d9c80" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
 hours.forEach((v,i)=>{if(Number.isFinite(v.aqi)&&v.aqi>=0)svg+=`<circle cx="${x(i)}" cy="${y(v.aqi)}" r="3" fill="${category(v.aqi).color}"><title>${time(v.time)}: AQI ${Math.round(v.aqi)}</title></circle>`;if(i%4===0||i===hours.length-1)svg+=`<text x="${x(i)}" y="200" text-anchor="middle" fill="#8b988d" font-size="11">${time(v.time,{minute:undefined})}</text>`;});
 $('chart').innerHTML=svg+'</svg>';
}
function renderPlan(){
 const duration=$('activity').value==='cycle'?2:1;const best=forecastWindow(data?.hours||[],duration);
 if(!best){$('plan').textContent='No complete forecast window is available.';return;}
 const sensitive=$('profile').value==='sensitive',threshold=sensitive?100:150;
 const result=document.createElement('strong');result.textContent=`${time(best.time,{weekday:'short'})} – ${time(best.end)} · AQI ${Math.round(best.average)}`;
 const p=document.createElement('span');p.textContent=best.peak>threshold?'Even the lowest forecast window has elevated pollution. Consider an indoor activity and follow local advisories.':(best.peak>50?'This is the lowest forecast window. Keep activity comfortable and reduce intensity if you are sensitive or notice symptoms.':'This is the lowest forecast window. Air quality is generally suitable for outdoor activity.');
 $('plan').replaceChildren(result,p);
}
async function load(next,demo=false){
 const id=++requestId;data=null;place=next;isDemo=demo;render();$('updated').textContent='Loading forecast…';$('data-badge').textContent='Loading';notice('');
 try{
  let incoming;
  if(demo)incoming=demoData();else{
   const fields=['us_aqi',...pollutants.map(p=>p[0])].join(',');
   const url=new URL('https://air-quality-api.open-meteo.com/v1/air-quality');url.search=new URLSearchParams({latitude:next.latitude,longitude:next.longitude,current:fields,hourly:'us_aqi',forecast_days:'3',timezone:'auto',timeformat:'unixtime'});
   const raw=await json(url);if(!raw.current||!raw.hourly?.time||!Array.isArray(raw.hourly.us_aqi))throw Error('Incomplete forecast response');
   const start=Math.floor(Date.now()/3600000)*3600;
   incoming={current:raw.current,timezone:raw.timezone,hours:raw.hourly.time.map((t,i)=>({time:t,aqi:raw.hourly.us_aqi[i]})).filter(v=>v.time>=start).slice(0,24)};
  }
  if(id!==requestId)return;data=incoming;render();if(demo)notice('Demo mode: all readings and forecast values are illustrative, not current conditions. Search for a city to return to online forecasts.');
 }catch(err){if(id!==requestId)return;data=null;render();$('data-badge').textContent='Unavailable';$('updated').textContent='Could not load forecast';notice('Air quality service is unavailable. Try searching again, or select “Try demo” to explore sample data.');}
}
$('search-form').onsubmit=async e=>{
 e.preventDefault();const query=$('search').value.trim();if(query.length<2)return;
 const id=++searchId;const b=e.currentTarget.querySelector('button');b.disabled=true;notice('Searching cities…');$('results').hidden=true;
 try{const raw=await json('https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name:query,count:6,language:'en',format:'json'}));if(id!==searchId)return;
  const results=raw.results||[];$('results').replaceChildren();$('results').hidden=!results.length;
  results.forEach(p=>{const button=document.createElement('button');button.type='button';button.textContent=label(p);button.onclick=()=>{$('results').hidden=true;load(p);};$('results').append(button);});notice(results.length?'Select a matching city below.':'No matching cities. Try a nearby city or a different spelling.');
 }catch{if(id===searchId)notice('City search is unavailable. Check your connection and try again.');}finally{if(id===searchId)b.disabled=false;}
};
$('locate').onclick=()=>{
 if(!navigator.geolocation){notice('Location is unavailable in this browser. Search for a city instead.');return;}
 $('locate').disabled=true;notice('Waiting for your location permission…');
 navigator.geolocation.getCurrentPosition(pos=>{$('locate').disabled=false;load({name:'Your location',country:`${pos.coords.latitude.toFixed(3)}°, ${pos.coords.longitude.toFixed(3)}°`,latitude:pos.coords.latitude,longitude:pos.coords.longitude});},()=>{$('locate').disabled=false;notice('Location permission was denied or location is unavailable. Search for a city instead.');},{timeout:12000,maximumAge:300000});
};
$('save').onclick=()=>{
 if(isDemo){notice('Search for a real city before saving a place.');return;}
 const exists=saved.some(p=>p.latitude===place.latitude&&p.longitude===place.longitude);
 if(exists)saved=saved.filter(p=>p.latitude!==place.latitude||p.longitude!==place.longitude);else saved=[place,...saved].slice(0,6);
 try{localStorage.setItem('urban-air-places',JSON.stringify(saved));notice(exists?'Place removed.':'Place saved in this browser.');}catch{notice('Browser storage is unavailable; saved places will last for this session.');}renderSaved();
};
$('demo').onclick=()=>{++searchId;$('search-form').querySelector('button').disabled=false;$('results').hidden=true;load({name:'Chennai',country:'India · Demo'},true);};
$('activity').onchange=renderPlan;$('profile').onchange=renderPlan;
$('today').textContent=new Intl.DateTimeFormat('en',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
categories.forEach((c,i)=>{const div=document.createElement('div');div.className='guide-item';div.style.setProperty('--c',c.color);div.innerHTML=`<strong>${i===0?'0':categories[i-1].max+1}${i===5?'+':'–'+c.max}</strong>${c.name}`;$('aqi-guide').append(div);});
load(defaults);
