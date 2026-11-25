import {test} from 'node:test';
import assert from 'node:assert/strict';
import {category,forecastWindow,demoData} from '../dist/air.js';
test('US AQI boundaries and unavailable values',()=>{
 for(const [n,name] of [[0,'Good'],[50,'Good'],[51,'Moderate'],[100,'Moderate'],[101,'Unhealthy for sensitive groups'],[150,'Unhealthy for sensitive groups'],[151,'Unhealthy'],[200,'Unhealthy'],[201,'Very unhealthy'],[300,'Very unhealthy'],[301,'Hazardous'],[550,'Hazardous']])assert.equal(category(n).name,name);
 for(const n of [null,undefined,NaN,-1,Infinity])assert.equal(category(n),null);
});
test('planner uses lowest contiguous window and earliest tie',()=>{
 const h=[60,20,30,20,30].map((aqi,i)=>({time:i*3600,aqi}));
 assert.equal(forecastWindow(h,2).time,3600);assert.equal(forecastWindow(h,2).average,25);
 assert.equal(forecastWindow([{time:0,aqi:10},{time:7200,aqi:10}],2),null);
 assert.equal(forecastWindow([{time:0,aqi:null}],1),null);assert.equal(forecastWindow([],2),null);
});
test('demo is a complete 24 hour forecast with a valid planning window',()=>{
 const data=demoData();assert.equal(data.hours.length,24);assert.ok(forecastWindow(data.hours,2));assert.equal(data.hours[23].time-data.hours[0].time,23*3600);
});
