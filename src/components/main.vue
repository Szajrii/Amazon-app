<template>
	<div class="main-view">
		<div class="line-separator-purple"></div>
		<div class="wrapper-user-info">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="wrapper-info">
							<div class="logo">
								<img src="../images/logo.png" alt="" height="30px">
							</div>
							<div class="user">
								<img src="../images/user.png" alt="" height="30px">
								<span>{{getUserName}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="wrapper-menu">
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-10 mx-auto">
						<div class="wrapper-tabs">
							<div class="tab" @click="tabActive=1" :class="{ active: tabActive===1 }">
								<span>Twoje zdjęcia</span>
							</div>
							<div class="tab" @click="tabActive=2" :class="{ active: tabActive===2 }">
								<span>Twoje filmy</span>
							</div>
							<div class="tab" @click="tabActive=3" :class="{ active: tabActive===3 }">
								<span>Dodaj zdjęcie</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-12 col-md-10 mx-auto">
					<div class="wrapper-content">
						<div class="video last" v-show="tabActive===2">
							<label class="form-label">Twóje ostatnie filmy</label>
							<div class="wrapper-your-video">
								<div class="row">
									<div class="col-12">
										<video width="480" height="480" controls :src="video"></video>
									</div>
								</div>
							</div>
						</div>
						<div class="video upload" v-show="tabActive===3">
							<label class="form-label">Dodaj zdjęcie</label>
							<div class="custom-file">
								<input type="file" class="custom-file-input" id="customFileLang" lang="es" @change="getFile($event)">
								<label class="custom-file-label" for="customFileLang">{{file.name}}</label>
							</div>
							<button @click="uploadFile" class="btn-sec" style="">Prześlij zdjęcie</button>
						</div>
						<div class="photo-container"  v-show="tabActive===1">
							<div class="video files">
								<label class="form-label">Twoje zdjęcia</label>
								<img src="../images/reload.png" alt="" height="20px" @click="listItems">
							</div>
							<div class="list-video">
								<div class="item" v-for="(item, index) in items">
									<div class="wrapper-img">
										<img :src="imagesSrc[index]"/>
										<p>{{item}}</p>
									</div>
									<div class="wrapper-add">
										<img src="../images/add.png" alt="" height="20px"  style="cursor: pointer" :id="index" @click="imageToAnimate($event)">
									</div>
								</div>
							</div>
							<div class="video files" v-show="images.length>0">
								<label class="form-label mt-5" for="video">Wybrane zdjęcia ({{images.length}})</label>
							</div>
							<div class="row">
								<div class="col-6 col-md-4 my-3" v-for="(img, index) in images" :id="index" @click="removeImage($event)">
									<div class="wrapper-selected-item">
										<div class="remove-wrapper">
											<img src="../images/remove.png" alt="" height="20px">
										</div>
										<img :src="getImageId(index)" alt=""   style="width: 100%">
									</div>
								</div>
							</div>
							<div class="row" v-show="images.length>0">
								<div class="col-12 my-4" style="text-align: center">
									<div class="make-film-action">
										<input type="text" placeholder="nazwa filmu" style="width: 50%">
										<button @click="serverRequest" class="btn-sec" style="margin: 0;">Stwórz film</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script type="text/javascript">
	import router from '../router';
	import {IdentityPoolId, bucketRegion, bucketName, poolData, region} from '../utils/env.js'
	import AWS from 'aws-sdk'
	import axios from "axios";




	export default {
		name: 'main',
		props: ['cognito','s3', 'token'],
		data(){
			return{
				// s3: {},
				items: [],
				tabActive: 1,
				keyID: 0,
				file: '',
				images: [],
				imagesSrc: [],
				video: ''
			}
		},
		computed: {
			getUserName(){
				return this.cognito.getUsername();
			},

		},
		methods:{

			listItems(){
				var pattern = /[jpg]$/g;
				var pattern2 = /[png]$/g;
				var pattern3 = /[jpeg]$/g;
				var pattern4 = /[jpeg2000]$/g;
				var pattern5 = /[gif]$/g;
			    console.log('elo');
				this.items = [];
				this.imagesSrc = [];

				this.s3.listObjects({Prefix: `${this.getUserName}/`}, (err, results) =>{
		        if(err){
		            return alert (err)
		        }
		        results.Contents.forEach( item => {
		        	if(item.Key.match(pattern) || item.Key.match(pattern2) || item.Key.match(pattern3) || item.Key.match(pattern4) || item.Key.match(pattern5)){

						this.items.push(item.Key)

						var params = {

							Bucket: 'uek-188345',
							Key: item.Key
						};

						var url = this.s3.getSignedUrl('getObject', params);
						this.imagesSrc.push(url)
					}

		        	
		        })
		        
			});
			this.getLastVideo();
			},

			uploadFile(){
			//dodac jesli wybierzesz pusty plik to nie przepusci
			 var params = {
				  Body: this.file, 
				  Bucket: bucketName,
				  Key: `${this.getUserName}/${this.file.name}`,
				  ACL: 'public-read-write',
			 };

			  this.s3.upload(params, function(err, data) {
				  console.log(err, data);
				});
			  this.items.push(`${this.getUserName}/${this.file.name}`);
			},

			getFile(file){
				this.file = file.target.files[0];
			},

			serverRequest(){
				axios.post('https://fkcs76z2le.execute-api.eu-central-1.amazonaws.com/dev/animation',{
					"token": this.token,
					"name": this.getUserName,
					"images": this.images
				}).then(({data}) => {
					console.log(data)
					this.getLastVideo();
				});
			},

			imageToAnimate(event){
				this.images.push(this.items[event.currentTarget.id])

			},

			getImageId(arrayId){
				var id = this.items.indexOf(this.images[arrayId])
				return this.imagesSrc[id]
			},

			removeImage(event){
				console.log(event.currentTarget.key)
				this.images.splice(event.currentTarget.id, 1)
			},
			getLastVideo(){
				var pattern = /twojevideo.mp4/i;
				var params = {
					Bucket: 'uek-188345',
					Key: `${this.getUserName}/video/twojevideo.mp4`
				};

				var url = this.s3.getSignedUrl('getObject', params);
				this.video = url;
			}
	
		},
		watch:{
			items: function(){

			}
		},
		created(){
			this.listItems();

		}
	};

</script>

<style scoped>
	li{
		cursor: pointer;
	}
</style>