import {downloadZip} from "client-zip";
import {load, IMemory} from "webassembly"

let open_button = <HTMLButtonElement>document.getElementById("open");
let previous_button = <HTMLButtonElement>document.getElementById("previous");
let next_button = <HTMLButtonElement>document.getElementById("next");
let file_input = <HTMLInputElement>document.getElementById("file-input");
let image : HTMLImageElement;
let canvas = <HTMLCanvasElement>document.getElementById("preview");
let ctx = canvas.getContext("2d");
let conv_button = <HTMLButtonElement>document.getElementById("conv");
let quality = <HTMLInputElement>document.getElementById("quality");

let file_data : Array<{name: string, adress: adress, size: number, type: string, compressed: adress}> = [];

type adress = number;

//let Module : {
let wasm: {
    convert_file : (location: adress, size: number, destination: adress, quality: number) => adress;
    __malloc: (size: number) => adress;
}
let memory: IMemory;

//load_wasm()
let imports = {
    __intscan: function(){alert("oups intscan !")},
    __shlim: function(){alert("oups shlim !")},
    memmove: function(){alert("oups memmove !")},
    pow: function(){alert("oups math.pow !")},
};

load('converter.wasm' ,{imports: imports, initialMemory:10000}).then(module => {memory = module.memory; wasm = <any>module.exports; window['wasm'] = wasm} )




let current_image = 0;

open_button.onclick=() => {file_input.click(); document.getElementById("selection").style.display = "none"}
previous_button.onclick = function(){current_image = (current_image-1+file_data.length)%file_data.length; request_test_image()};
next_button.onclick = function(){current_image = (current_image+1+file_data.length)%file_data.length; request_test_image()};
conv_button.onclick=()=>{conv_button.style.visibility="hidden";convert_and_zip()};
file_input.addEventListener('change', read_all_images);

quality.onchange = () => request_test_image();



function request_test_image() {
    ctx.strokeStyle = "green";
    ctx.font = "70px serif";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeText(". . .", canvas.width/4, canvas.height/2, )

    document.getElementById("value").innerText = (<any>quality.value).toString();
    document.getElementById("size").innerText = "";

    setTimeout(test_image, 30);
}


function test_image(){
    let result = convert_image(file_data[current_image]);
    document.getElementById("size").innerText = `= ${(Math.round(result.size/1000))}K`;

    image = new Image();
    image.src = window.URL.createObjectURL(result);
    image.onload = function(){
        let aspect_ratio = image.width/image.height;
        let width = Math.min(window.innerWidth*0.9, innerHeight*0.7*aspect_ratio);
        canvas.width = width;
        canvas.height = width/aspect_ratio;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
}


function read_all_images() {
        // loop through all images and read them
        for (let i = 0; i<file_input.files.length; i++){
                let file = file_input.files[i];
                var converter = new FileReader();

                converter.addEventListener("loadend", function(e){
                        // add to list of files already red
                        let result = new Uint8Array(<ArrayBuffer>e.target.result);
                        let adress = wasm.__malloc(result.length)
                        let compressed = wasm.__malloc(result.length);
                        memory.U8.set(result, adress)

                        file_data.push({
                                name : file.name,
                                type: file.type,
                                adress: adress,
                                size: result.length,
                                compressed: compressed,
                        });
                        // everything is red
                        if (file_data.length == file_input.files.length) {
                                console.log(file_data);
                                conv_button.style.visibility="visible";
                                quality.style.visibility = "visible";
                                next_button.style.visibility = "visible";
                                previous_button.style.visibility = "visible";
                                request_test_image();
                        }
                });
                converter.readAsArrayBuffer(file);
        }
}


function convert_image(f: { name: any; adress: any; size: any; type?: string; compressed: any; }) : File {
    let q = <any>(quality.value) / 200.0;

    let new_size = wasm.convert_file(f.adress, f.size, f.compressed, q);
    return new File([memory.U8.slice(f.compressed, f.compressed+new_size)], f.name+".jpg");
}


async function convert_and_zip() {
    let n_files = file_data.length;

    let image_files = [];

    for(let i = 0; i<n_files; i++){
        let f = file_data[i];
        let r = convert_image(f);
        image_files.push(r);
    }
    const zip = await downloadZip(image_files).blob(); 

    const link = document.createElement("a")
    link.href = URL.createObjectURL(zip)
    link.download = "test.zip"
    link.click()
    link.remove()
}
