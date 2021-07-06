const prompts = require('prompts');
var fs = require('fs'),
 PNG = require('pngjs').PNG;
 
const questions = [
  {
    type: 'number',
    name: 'width',
    message: 'Rectangle Width (Pixels): ',
    validate: value => value <= 0 ? `Positive Numbers Only!` : true
  },
  {
    type: 'number',
    name: 'height',
    message: 'Rectangle Height (Pixels): ',
    validate: value => value <= 0 ? `Positive Numbers Only!` : true
  },
  {
    type: 'text',
    name: 'path',
    message: 'Drag n\' Drop Png File: ',
    //validate: value => fs.exists(response.path) ? `Not a true file path` : true
  },
  {
    type: 'text',
    name: 'outputName',
    message: 'Name of output file (Warning Will Replace File with same name):',
  },
];

 
(async () => {
  const response = await prompts(questions);
 
  // => response => { username, age, about }
  input_width = response.width;
  input_height = response.height;

  myFile = "/" + response.path.replace(/\"/g,'').replace(/C:\\/g,'');


function rgba(r,g,b,a){
    return {
        r: r,
        g: g,
        b: b,
        a: a
    };
}

    var squares = [];
    var red_avg = 0;
    var green_avg = 0;
    var blue_avg = 0;
    var alpha_avg = 0;
 
//
//ASK FOR PATH AND HEIGHT/WIDTH OF BOXES
//

fs.createReadStream(myFile)
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {

        square_width = input_width;
        square_height = input_height;

        squares_wide = Math.ceil(this.width/square_width)
        squares_high = Math.ceil(this.height/square_height)

        num_squares = squares_wide*squares_high;
 
    for(var square = 0; square < num_squares; square++){
        for (var y = square_height* Math.floor(square/squares_wide); y < square_height* Math.floor(square/squares_wide)+square_height; y++) {
            for (var x = square_width*(square%squares_wide); x < square_width*(square%squares_wide)+square_width; x++) {
                var idx = (this.width * y + x) << 2;

                //pertend white if out of bounds
                if(y>=this.height || x>=this.width){
                    red_avg += 255;
                    green_avg += 255;
                    blue_avg += 255;
                    alpha_avg += 255;
                } else{
                red_avg += this.data[idx];
                green_avg += this.data[idx+1];
                blue_avg += this.data[idx+2];
                alpha_avg += this.data[idx+3];
                }
            }
        }

        red_avg /= square_width*square_height;
        blue_avg /= square_width*square_height;
        green_avg /= square_width*square_height;
        alpha_avg /= square_width*square_height;

        squares[square] = rgba(red_avg, green_avg, blue_avg, alpha_avg);

        red_avg = 0;
        blue_avg = 0;
        green_avg = 0;
        alpha_avg = 0;
        
    }

    //console.log(squares);



    var png = new PNG({
        width: square_width*squares_wide,
        height: square_height*squares_high,
        filterType: -1
    });

    for(var square = 0; square < num_squares; square++){
        for (var y = square_height* Math.floor(square/squares_wide); y < square_height* Math.floor(square/squares_wide)+square_height; y++) {
            for (var x = square_width*(square%squares_wide); x < square_width*(square%squares_wide)+square_width; x++) {
                var idx = (png.width * y + x) << 2;
 
                png.data[idx  ] = squares[square].r;
                png.data[idx+1] = squares[square].g;
                png.data[idx+2] = squares[square].b;
                png.data[idx+3] = squares[square].a;
            }
        }
    }
 

    OutPath = (myFile.slice(0, myFile.lastIndexOf("\\"))+ "\\"+ response.outputName + ".png").replace(/\"/g,'')
    //console.log(OutPath);
        png.pack().pipe(fs.createWriteStream(OutPath));
    });



})();