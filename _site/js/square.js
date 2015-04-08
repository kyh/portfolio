(function(win){
'use strict';

function Gif(elementParent) {
	this.animationDuration = 0.6;
	this.squares = [];
	this.colors = [0x262626, 0xe1e1c6];
	this.index = 0;
	this.nbRepeat = 0;
	this.elementParent = elementParent;
}

Gif.prototype.init = function init(){
	var self = this;
	this.scene = new THREE.Scene();
	this.initCamera();
	this.initRenderer();
	this.initLights();
	this.createSquares();
	this.render();
	return function then(cb){
		cb(self.elementParent);
	};
};

Gif.prototype.initCamera = function initCamera() {
	this.camera = new THREE.OrthographicCamera( this.elementParent.offsetWidth / - 2, this.elementParent.offsetWidth / 2, this.elementParent.offsetHeight / 2, this.elementParent.offsetHeight / - 2, 1, 1000 );
	this.camera.position.y = 500;
	this.camera.position.z = 500;
	this.camera.position.x = 500;
	this.camera.updateProjectionMatrix();
	this.camera.lookAt(this.scene.position);
};

Gif.prototype.initRenderer = function initRenderer() {
	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.setSize( this.elementParent.offsetWidth, this.elementParent.offsetHeight );
	this.renderer.setClearColor( 0x262626, 1 );
	this.elementParent.appendChild(this.renderer.domElement);
};

Gif.prototype.initLights = function initLights() {
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 100, 0 );
	this.scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 100, 0, 0 );
	this.scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 0, 100 );
	this.scene.add( light );
};

Gif.prototype.createSquares = function createSquares() {
	this.squareGroup = new THREE.Group();
	this.scene.add(this.squareGroup);

	this.row1 = new THREE.Group();
	this.squareGroup.add(this.row1);

	this.squarePivot = new THREE.Object3D();
	this.squareGroup.add(this.squarePivot);

	this.row3 = new THREE.Group();
	this.squareGroup.add(this.row3);
	
	this.tl = new TimelineMax({repeat: -1, delay: 0.5, onRepeat: this.onRepeatAnimation.bind(this)});
	for ( var k=0 ; k<3 ; ++k ) {
		for ( var j=0 ; j<3 ; ++j ) {
			for (var i = 0 ; i<3 ; ++i ) {
				this.index++;
				this.geometry = new THREE.BoxGeometry( 50, 50, 50 );
				this.material = new THREE.MeshLambertMaterial({color : this.colors[this.index%2], shading: THREE.FlatShading});
				this.square = new THREE.Mesh(this.geometry, this.material);
				this.square.position.x = (i-1)*50;
				this.square.position.y = (j-1)*50;
				this.square.position.z = (k-1)*50;
				this.squares.push(this.square);
				this.squareGroup.add(this.square);
				
				if ( i === 2 ) {
					this.row1.add(this.square);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50+20, ease: Expo.easeIn}, 0);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50, ease: Expo.easeOut}, this.animationDuration);
				} else if ( i === 0 ) {
					this.row3.add(this.square);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50-20, ease: Expo.easeIn}, 0);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50, ease: Expo.easeOut}, this.animationDuration);
				} else {
					this.squarePivot.add(this.square);
					this.tl.fromTo(this.squarePivot.rotation, this.animationDuration*1.6, {x: 0}, {x: Math.PI/2, ease: Expo.easeInOut}, this.animationDuration*0.45);
				}
			}
		}
	}
};

Gif.prototype.onRepeatAnimation = function onRepeatAnimation() {
	if (this.nbRepeat === 0) {
		this.squareGroup.rotation.y = Math.PI/2;
		this.squareGroup.rotation.z = 0;
	} else if (this.nbRepeat == 1) {
		this.squareGroup.rotation.y = 0;
		this.squareGroup.rotation.z = Math.PI/2;
	} else {
		this.squareGroup.rotation.y = 0;
		this.squareGroup.rotation.z = 0;
	}
	this.nbRepeat = ( this.nbRepeat+1 > 2 ) ? 0 : this.nbRepeat+1;
};

Gif.prototype.render = function render() {
	requestAnimationFrame(this.render.bind(this));
	this.renderer.render(this.scene, this.camera);
};

window.Gif = Gif;

})(window);