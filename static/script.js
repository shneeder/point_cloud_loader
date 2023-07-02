import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls'

// Define the necessary variables
let pointCloud;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set up the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas").appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Attach event listeners to the file inputs
document.getElementById('plyFileInput').addEventListener('change', handlePLYFileUpload);
document.getElementById('jsonFileInput').addEventListener('change', handleJSONFileUpload);


// Load the PLY file and render the point cloud
function loadPointCloud(geometry) {
    const totalVertices = geometry.getAttribute('position').count;
    let colors = new Float32Array(totalVertices * 3); 

    // Set the color of point cloud to white for initial check
    let color = new THREE.Color();
    color.set(0xffffff);

    for (let i = 0; i < totalVertices; i++) {
        colors[i * 3] = color.r; 
        colors[i * 3 + 1] = color.g; 
        colors[i * 3 + 2] = color.b; 
    }

    // Create a color attribute and set it on the geometry
    const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
    geometry.setAttribute('color', colorAttribute);

    // Create a PointsMaterial with vertex colors enabled
    const material = new THREE.PointsMaterial({ vertexColors: true });

    // Create Points object using the geometry and material
    pointCloud = new THREE.Points(geometry, material);
    scene.add(new THREE.AxesHelper(5));
    // Add the point cloud to the scene
    scene.add(pointCloud);
    // Render the scene
    animate();        
}

// Function to animate and render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Function to handle PLY file upload
function handlePLYFileUpload(event) {
    console.log("handlePLYFileUpload triggered");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const loader = new PLYLoader();
        const geometry = loader.parse(event.target.result);
        loadPointCloud(geometry);
    };

    reader.readAsArrayBuffer(file);
    camera.position.set(7, 3, 7);
    camera.lookAt(0, 0, 0);
}

// Function to handle JSON file upload
function handleJSONFileUpload(event) {
    console.log("handleJSONFileUpload triggered");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function (event) {
        const clusterData = JSON.parse(event.target.result);
        const clustersFilter = clusterData.clustersFilter;
        const clustersIndices = clusterData.clustersIndices;
        // Can be maybe substituted by pulling from clusterData.pointCloudWidth 
        const totalVertices = clustersIndices.reduce(
            (total, indices) => total + indices.length, 0
        )
        let colors = new Float32Array(totalVertices * 3);

        for (let clusterIndex = 0; clusterIndex < clustersFilter.length; clusterIndex++) {
            // Set color based on cluster index
            let color = new THREE.Color();

            // Cluster 0: Green
            if (clustersFilter[clusterIndex] && clusterIndex === 0) {
                color.set(0x00ff00);
            // Cluster 1: Yellow    
            } else if (clustersFilter[clusterIndex] && clusterIndex === 1) {
                color.set(0xffff00);
            // Cluster 2: Red    
            } else if (clustersFilter[clusterIndex] && clusterIndex === 2) {
                color.set(0xff0000);
            }

            const clusterIndices = clustersIndices[clusterIndex];
            // Assign color to vertices
            for (let i = 0; i < clusterIndices.length; i++) {
                const vertexIndex = clusterIndices[i];
                // Times 3 due to RGB
                const vertexColorIndex = vertexIndex * 3;

                colors[vertexColorIndex] = color.r;
                colors[vertexColorIndex + 1] = color.g;
                colors[vertexColorIndex + 2] = color.b;
            }
        }

        // Update point cloud's vertex colors
        pointCloud.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        pointCloud.geometry.attributes.color.needsUpdate = true;
        animate();
        console.log("Point cloud:")
        console.log(pointCloud);
    };

}
