import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import axios,{ post } from 'axios';
import { Button,InputGroup ,FormControl  } from 'react-bootstrap';
import {useHistory} from "react-router-dom"
function WriteMain() {
  let history = useHistory(); 
  const [imgBase64, setImgBase64] = useState([]); // 파일 base64
  const [imgFile, setImgFile] = useState(null);	//파일	
  var images = []
 
  const handleChangeFile = (event) => {
    console.log(event.target.files)
    setImgFile(event.target.files);
    //fd.append("file", event.target.files)
    setImgBase64([]);
    for(var i=0;i<event.target.files.length;i++){
    if (event.target.files[i]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]); // 1. 파일을 읽어 버퍼에 저장합니다.
      // 파일 상태 업데이트
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
        //  images.push(base64.toString())
        var base64Sub = base64.toString()
           
        setImgBase64(imgBase64 => [...imgBase64, base64Sub]);
        //  setImgBase64(newObj);
          // 파일 base64 상태 업데이트
        //  console.log(images)
        }
      }
    }
  }

  }


  const WriteBoard = async()=> {
    if(imgFile == null){
      alert("이미지를 등록 해주세요");
      return false;
    }
    const fd = new FormData();
    Object.values(imgFile).forEach((file) => fd.append("image", file));

    const fd2 = new FormData();
    await axios.post('https://dapi.kakao.com/v2/vision/text/ocr', fd, {
  headers: {
		Authorization: `KakaoAK b7e80494b2e4956447d4885bfae95ff9`,
    "Content-Type": `multipart/form-data; `,
  }
})
.then((response) => {
   
    console.log(response);
    console.log(response.status);
})
.catch((error) => {
  // 예외 처리
  console.log(error)
})

  } 
    return (
      <div class="FlexRow_c">
      <div class="FlexCol_c">
        <input type="file" id="file" style={{display:'none'}} onChange={handleChangeFile} multiple="multiple" />
        <label for="file" class="FlexCol_c" style={{border:'2px solid black',width:'700px',height:'300px',marginTop:'100px',fontSize:'40px'}}><strong>FILE UPLOAD <br/> Click here!</strong></label>
		<br/>
        <button onClick={WriteBoard} style={{border:'2px solid black',width:'700px',fontSize:'40px'}}>작성완료</button>
      </div>
      <div class="borderBox" style={{width:'700px', height:"560px",marginTop:'100px',marginLeft:'60px',border:'2px solid black'}}>
      <Carousel interval={null}>
      {imgBase64.map((item) => {
       return(
		<Carousel.Item>
			<img
			  className="d-block w-100"
			  src={item}
			  alt="First slide"
			  style={{width:"100%",height:"550px"}}
			/>
			<Carousel.Caption>
			  <h3>First slide label</h3>
			  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
			</Carousel.Caption>
			</Carousel.Item>
			)
			}) }
		</Carousel>
      </div>
      </div>
    );
  }
  

  export default WriteMain;  