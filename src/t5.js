import { Component } from 'react';


function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var bb = new Blob([ab]);
    return bb;
}

class Upload extends Component {
	
  constructor() {
    super();
    this.state = {
      image: '',
    }
  }

  handleFileChange = e => {
    this.setState({
      [e.target.name]: e.target.files[0],
    })
  }


  handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    for (let name in this.state) {
		console.log(name);
		console.log(this.state[name]);
      formData.append(name, this.state[name]);
    }

    await fetch('https://dapi.kakao.com/v2/vision/text/ocr', {
      method: 'POST',
      headers: {
		Authorization: `KakaoAK b7e80494b2e4956447d4885bfae95ff9`,
		"Content-Type": "multipart/form-data",
      },
      files: formData,
    })
	.then(response=>{
        console.log("결과")
        console.log(response)
        console.log("결과"+response.ok)
        console.log(response.json())
		console.log("============");
        if(response.ok)
            return response.json()
        else{
            throw new Error(response)
        }
    })
    .then(response=>{
        alert(response.status)
    })
    .catch(error =>  { 
			console.log('Registration error');
			console.log(error); 
	});


    console.log(formData);
  }

  render() {
    return (
    <>
      <form onSubmit={this.handleSubmit}>
        <input accept="image/*" name="image" type="file" onChange={this.handleFileChange}></input>
        <input type="submit"></input>
      </form>
    </>
  )
  }
}

export default Upload;

//curl -v -X POST "https://dapi.kakao.com/v2/vision/text/ocr" \
//    -H "Content-Type: multipart/form-data" \
//    -H "Authorization: KakaoAK ${REST_API_KEY}" \
//    -F "image=@sample.jpg" 