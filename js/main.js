import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    TextureLoader,
    AnimationMixer,
    ConeGeometry,
    MeshPhongMaterial,
    Mesh,
    BoxGeometry,
    Box3,
    Vector3,
    Box3Helper,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "loaders";
  
// 各変数、各定数の宣言
// レーンの設定
let index = 1;
const course = [-5, 0, 5];

let mixer;

// エリアの設定
const gravity = 0.05 // 重力

// エリアで用いられる 3D モデルと写真のダウンロード
const textureloader = new TextureLoader();
const glbloader = new GLTFLoader();

let isOnce = false;
let ios = true;

// プレイヤーの変数定数を宣言
let player;
let playerBox;
let playerBoundingBox;
let goalBoundingBox;
let player_v_y = 0;
const initial_velocity = 0.8;
let isJumping = false;
let isMoving = false;
let goal;
let isGoal = false;
let box_X;
let box_Y;
let box_Z;

// センサー
let alpha;
let beta;
let gamma;
let aX;
let aY;
let aZ;

let phone_list = [];
let enemy_list = [];

// シーン
var scene = new Scene();
// カメラ
const camera = new PerspectiveCamera(
    90, // 視野角
    window.innerWidth / window.innerHeight, //アスペクト比
    0.1, // 一番見える近いところ
    10000, // 一番見える遠いところ
)
camera.position.set(0, 4, 10)

// レンダラー
const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// カメラの手動
const controls = new OrbitControls(camera, renderer.domElement)

// ライト
// 並行光源の作成
// 場所によって影が変更されない
const light = new DirectionalLight(0xffffff, 1)
light.position.set(10, 10, 10)
scene.add(light);

function iosOrAndrooid(aX, aY, aZ) {
    let crossProduct = aX * aY;
    if (crossProduct * aZ < 0) {
         ios = false;
    }
}

// texture内に保存されているjpgのパス
const textureUrls = [
    'textures/ground.jpg', // 道
    '', // ゴールテープ
];

// 読み込むGLBモデルのパス
const glbUrls = [
    'models/player',// プレイヤー // ここに追加
    'models/houses.glb',// 周り
    'models/phone.glb', // スマホ
    '', // 障害物１ // ここに追加
    '', // 障害物2
];

// プレイヤーの描写
// ここに記述

// 建物の描写
glbloader.load(glbUrls[1], function (gltf) {
    for ( var i = -40 ; i <= 40 ; i++){
        if (i !== 0){
            var model = gltf.scene.clone()
            model.rotation.set(0, ( Math.PI / 2 ) * Math.sign(i),0) // 建物が横を向くように回転
            model.position.set(-14 * Math.sign(i),0, 20-10 * Math.abs(i)) // 建物をコースの両端に配置
            scene.add(model)
        }
    }
},undefined, function ( error ) {
	console.error( error );
} );

// スマホの描写
// ここに記述

// 障害物の描写
for (var g=1 ; g<12 ; g++ ){
    const groundGeometry = new ConeGeometry( 1, 4, 32 ); // コーンのジオメトリを作成 (BoxGeometry)
    var sphereMaterial = new MeshPhongMaterial({color:0xFF0000});
    const model = new Mesh(groundGeometry, sphereMaterial); // メッシュを作成 (ジオメトリ + マテリアル)
    const randomIndex = Math.floor(Math.random() * 3) // 0,1,2のランダム
    model.position.set(course[randomIndex],2, -15*(g+1))
    enemy_list.push(model)
    scene.add(model)
}

// 道の描写
textureloader.load(textureUrls[0], function (texture) {
    const groundGeometry = new BoxGeometry(24, 0.5, 400); // 地面のジオメトリを作成 (BoxGeometry)
    var sphereMaterial = new MeshPhongMaterial();
    sphereMaterial.map = texture;
    const ground = new Mesh(groundGeometry, sphereMaterial); // メッシュを作成 (ジオメトリ + マテリアル)
    ground.position.set(0, -0.3, -180); // 地面の位置を設定
    ground.receiveShadow = true; // 影を受け取る設定
    scene.add(ground);
},undefined, function ( error ) {
	console.error(error);
} );

// ゴールテープの描写
// ここに記述

// センサーの値の読み取り
document.addEventListener("DOMContentLoaded", function () {
    aX = 0, aY = 0, aZ = 0;                     // 加速度の値を入れる変数を3個用意
    alpha = 0, beta = 0, gamma = 0;  

    // 加速度センサの値の取得
    if (ios){
        // iosの時
        // ここに追加
    }else{
        // androidの時
        // ここに追加
    }
    
    // 一度だけ実行
    if (!isOnce) {
        iosOrAndrooid(aX, aY, aZ);
        isOnce = true;
      }

    // ジャイロセンサーの値の取得
    // ここに追加

    // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
    var graphtimer = window.setInterval(() => {
        displayData();
    }, 33); // 33msごとに

    function displayData() {
        var result = document.getElementById("result");
        result.innerHTML =
            "alpha: " + alpha.toFixed(2) + "<br>" +
            "beta: " + beta.toFixed(2) + "<br>" +
            "gamma: " + gamma.toFixed(2) + "<br>" +
            "aX" + aX + "<br>" +
            "aY" + aY + "<br>" +
            "aZ" + aZ + "<br>"
    }
})

// プレイヤーの左右移動
function move(){
    // ここに追加
}

// プレイヤーのジャンプ
function jump(){
    // ここに追加
}

// 衝突判定
function collision(){
    box_X = 0;
    box_Y = 0;
    box_Z = 0; // サイズが合うように変えてみましょう。
    var geometry = new BoxGeometry(box_X,box_Y,box_Z)
    const material = new MeshPhongMaterial({color: 0xFF0000});
    playerBox = new Mesh(geometry, material);
    playerBox.position.set(player.position.x,player.position.y + box_Y,player.position.z)
    playerBox.updateWorldMatrix(true, true);
    const playerBoundingBox = new Box3().setFromObject(playerBox);
    const playerHelper = new Box3Helper(playerBoundingBox, 0xff0000);
    scene.add(playerHelper)
    // 障害物との衝突
    // ここに追加

    // スマホとの衝突 
    // ここに追加

    // ゴールテープとの衝突
    if (goal){
        goalBoundingBox = new Box3().setFromObject(goal);
        if (playerBoundingBox.intersectsBox(goalBoundingBox)) { 
            isGoal = true     
            console.log('ゴール')     
            localStorage.setItem('getPhone', getPhone);
            localStorage.setItem('isGoal', isGoal);
            window.location.href = "./index.html";
        }
    }
}

function animate(){
    const animationId = requestAnimationFrame(animate)

    // 追加 Mixer

    renderer.render(scene, camera);
}

// ウィンドウのリサイズイベントをリッスン
window.addEventListener('resize', () => {
    // レンダラーのサイズを更新
    renderer.setSize(window.innerWidth, window.innerHeight);

    // カメラのアスペクト比を更新
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // プロジェクションマトリクスを更新
});

animate();