import {flattenSVG} from 'flatten-svg';
//import _ from 'lodash';

var silkscreenHeader = 
`G04 Silkscreen top layer*
%FSAX35Y35*%
G71*
G01*
G75*
%MOMM*%
%ADD10C,1.5*%
G04 start drawing*
D10*
`

var gerberEOF = `M02*`

var svgInputStr = document.getElementById('svg_input').value;

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
       console.log(document.getElementById('svg_input').value)

        //get svg source code from textbox
       var mySvg = svgElementFromString(document.getElementById('svg_input').value);

        //use flatten-svg to get points representing svg
       let mypaths = flattenSVG(mySvg);
        console.log('flattenSVGPoints')
    
        //generate gerber from points
        var gerberFromPoints = generateSilkscreenFromPoints(mypaths)
    
        download('silkscreen_top.GTO', gerberFromPoints);
    }


});

var svg = document.getElementById('test-svg')

//body.innerHTML += `<button id='convert-button' onclick='convert()' size>convert</button>`

var svgElementFromString = function(str) {
    var div = document.createElement('DIV');
    div.innerHTML = str;
    var svg = div.querySelector('svg');
    if (!svg) { console.log('No SVG found in loaded contents'); return; }
    else return svg;
  }

  //Take in points array from flatten-svg and convert to gerber
function generateSilkscreenFromPoints(pointsArray){
    
    var silkscreenStr = ``
    silkscreenStr += silkscreenHeader;
    silkscreenStr += `X0Y0D03\n`


    pointsArray.forEach(points => {
        var pointCounter = 0
        points.points.forEach(point => {

            var startPointX = parseInt(parseFloat(point[0]).toFixed(5).replace('.', '')) 
            var startPointY = parseInt(parseFloat(point[1]).toFixed(5).replace('.', '')) 

            if (pointCounter === 0){
                silkscreenStr += `X${startPointX}Y-${startPointY}D03*\n`
            } else {
                silkscreenStr += `X${startPointX}Y-${startPointY}D01*\n`
            }
            //console.log(point);

            pointCounter ++;

        })
    })
  
    silkscreenStr += gerberEOF;

    return silkscreenStr;
}

function download(filename, text)
{
 
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}



/* 
PREVIOUS METHOD OF GENERATING GERBER FROM SVG PATHS

var svg = `
<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
 <g>
  <title>Layer 1</title>
  <line id="svg_37" y2="75.40317" x2="77.01607" y1="3.4678" x1="2.17748" stroke="#000" fill="none"/>
  <line id="svg_38" y2="3.95167" x2="76.85478" y1="74.43543" x1="2.98393" stroke="#000" fill="none"/>
 </g>

</svg>`

var gerberOut = svg_2_gerber(svg);
//download('silkscreen_top.GTO', gerberOut);
console.log(gerberOut);

 function svg_2_gerber(svg){

    var gerberStr = ``;

    let lines = getLines(svg);

    let mapping = createMapping(lines);

    gerberStr = generateSilkscreen(mapping);
 
    return gerberStr;
}

function generateSilkscreen(mapping){
    var silkscreenStr = ``

    silkscreenStr += silkscreenHeader;
    silkscreenStr += `X0Y0D03\n`

    mapping.forEach(line => {
        let x1 = line.x1, x2 = line.x2, y1 = line.y1, y2 = line.y2;


         var startPointX = parseInt(parseFloat(x1).toFixed(5).replace('.', '')) 
        var endPointX = parseInt(parseFloat(x2).toFixed(5).replace('.', ''));
        
        var startPointY = parseInt(parseFloat(y1).toFixed(5).replace('.', '')) 
        var endPointY = parseInt(parseFloat(y2).toFixed(5).replace('.', '')); 


        silkscreenStr += `X-${startPointX}Y-${startPointY}D03*\n`
        silkscreenStr += `X-${endPointX}Y-${endPointY}D01*\n`
        
    })

    silkscreenStr += gerberEOF;

    return silkscreenStr;
}


//take string with svg and isolate all the line tags
function getLines(svgString){
    console.log(svgString);


    var svgSplit = svgString.split('\n');

    var lines = [];

    for (let i=0; i<svgSplit.length; i++){
        console.log(svgSplit[i])
        if (svgSplit[i].includes('<line')){
            lines.push(svgSplit[i]);
        }
    }

    console.log(lines);

    return lines;
     
}


function createMapping(lines){
    
    var mapping = [];
    
    lines.forEach(line => {
        var elements = line.split(' ');

        var id, x1, x2, y1, y2, stroke = null;

        elements.forEach(element => {

            if (element.substring(0,2) === 'id'){
                id = element.replace('id=', '').replace('\"', '').replace('\"', '');
            } 
            else if (element.substring(0, 2) === 'x1'){
                x1 = element.replace('x1=', '').replace('\"', '').replace('\"', '');
            } else if (element.substring(0, 2) === 'x2'){
                x2 = element.replace('x2=', '').replace('\"', '').replace('\"', '');;
            } else if (element.substring(0, 2) === 'y1'){
                y1 = element.replace('y1=', '').replace('\"', '').replace('\"', '');;
            } else if (element.substring(0, 2) === 'y2'){
                y2 = element.replace('y2=', '').replace('\"', '').replace('\"', '');;
            } else if (element.substring(0, 2) === 'st'){
                stroke = element.replace('stroke=', '').replace('\"', '').replace('\"', '');;
            }

        })


        mapping.push({
            id: id, 
            x1: x1, 
            x2: x2,
            y1: y1,
            y2: y2, 
            stroke: stroke,
        })
    })

    console.log(mapping);

    return mapping;
}

 */

