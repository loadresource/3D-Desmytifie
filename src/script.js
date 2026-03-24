import  {vs as pangerVertices, fs as pangerFaces }from './modules/penger.js'

const FOREGROUND = '#50FF50'
const BACKGROUND = '#101010'
const FPS = 60
console.log(game);

//set canvas size
game.width = 800
game.height = 800

//get context 2d
const ctx = game.getContext('2d')

//clear screen
function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0,0,game.width,game.height)
}

//draw point(vertices)
function point({x=0,y=0}) {
    const s = 20
    ctx.fillStyle = FOREGROUND
    // ctx.fillRect(x,y,100,100)
    ctx.fillRect(x-s/2,y-s/2,s,s)
}

//draw line between two points
function line(p1,p2) {
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.strokeStyle = FOREGROUND
    ctx.stroke()
}

//project 3d point to 2d
function project({x=0,y=0,z=0}) {
    return {
        x: x/z,
        y: y/z
    }
}

//convert normalized coordinates to screen coordinates
function screen(p) {
    //normalize coordinates
    //(p.x + 1)/2*game.width
    //(p.y + 1)/2*game.height
    return{
        x: (p.x + 1)/2*game.width,
        //invert y axis
        y: (1 - (p.y + 1)/2)*game.height
    }
}

//
function translate_z({x,y,z}, dz) {
    return {x,y,z: z + dz}
}

//rotate around y axis
//formula rotate vector
function rotate_xz({ x, y, z }, angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
        //x:x*c-y*s
        //x:x*s+y*c
        //replace y with z
        x: x * cos - z * sin,
        y,
        z: x * sin + z * cos
    }
}

//vertices
// const vertices = [
//     {x:  0.25, y:  0.25, z: 0.25},
//     {x: -0.25, y:  0.25, z: 0.25},
//     {x: -0.25, y: -0.25, z: 0.25},
//     {x: 0.25, y: -0.25, z: 0.25},
    
//     {x:  0.25, y:  0.25, z: -0.25},
//     {x: -0.25, y:  0.25, z: -0.25},
//     {x: -0.25, y: -0.25, z: -0.25},
//     {x:  0.25, y: -0.25, z: -0.25}
// ]

// const faces = [
//     [0,1,2,3],
//     [4,5,6,7],
//     //connect faces
//     [0,4],
//     [1,5],
//     [2,6],
//     [3,7]
// ]

//panger model
const vertices = pangerVertices
const faces = pangerFaces


let angle = 0
let dz = 1

//animate
function frame() {
    //delta time
    const dt = 1/FPS
   // dz +=1*dt
    //revolve 1 rotation every 1 seconds
    //angle += 2 * Math.PI * dt
    angle += Math.PI * dt


    clear()
    
    //render vertices
    // for (const vertex of vertices) {
    //     point(screen(project(translate_z(rotate_xz(vertex,angle), dz))))
    // }

    //draw faces
    for (const face of faces) {
        for (let index = 0; index < face.length; index++) {
            const vertexIndex = vertices[face[index]];
            const nextVertexIndex = vertices[face[(index + 1) % face.length]];
            line(screen(project(translate_z(rotate_xz(vertexIndex, angle), dz))), screen(project(translate_z(rotate_xz(nextVertexIndex, angle), dz))));
        }
    }
    setTimeout(frame, 1000/FPS);
}

setTimeout(frame, 1000/FPS);