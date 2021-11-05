// 이미지 업로드 테스트
import React, { useState } from 'react';

const T2 = () => {
 
//	const [image, setImage ] = useState("");
	const [ url, setUrl ] = useState("");

	const uploadImage = (image) => {

		const data = new FormData()
		data.append("file", image)
		data.append("upload_preset", "quizReact")
		data.append("cloud_name","dv8img")
		fetch("https://api.cloudinary.com/v1_1/dv8img/upload",{
			method:"post",
			body: data
		})
			.then(resp => resp.json())
			.then(data => {
			setUrl(data.url)
		})
		.catch(err => console.log(err))
	}

  return (
    <div>
		<div>
			<label htmlFor="input-file">
			  <img src='https://res.cloudinary.com/dv8img/image/upload/c_thumb,w_100,g_face/v1633486673/web/2_wdihjr.png'/>
			</label>
			<input type="file" onChange= {(e)=> uploadImage(e.target.files[0])} id="input-file" />
		</div>
		<div>
			<img src={url}/>	  
		</div>
	</div>
  );
}

export default T2;