import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import axios,{ post } from 'axios';
import { Button,InputGroup ,FormControl  } from 'react-bootstrap';
import {useHistory} from "react-router-dom"
function WriteMain() {
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////    카카오톡 공유하기 버튼 테스트
//////////////////////////////////////////////////////////////////////////////////////////////////////
	const url = "http://gift.bnbd.co.kr"; //현재 url가져오기
	  useEffect(() => {
		initKakao(); //
	  }, []);

	//자바스크립트키로 카카오 init
	  const initKakao = () => {

		if (window.Kakao) {
		  const kakao = window.Kakao;
		  if (!kakao.isInitialized()) {
			kakao.init(process.env.REACT_APP_KAKAO_TOKEN);
		  }
		}
	  };

	//버튼을 누르면 실행되는 함수
	  const shareKakao = () => {
	//이부분이 매우 헷갈림 여러 사이트를 참고했는데 이 sendDefault부분을 잘 봐야한다.
		window.Kakao.Link.sendDefault({ 
		  objectType: 'feed',
		  content: {
			title: '홍길동님의 선물이 도착했습니다.',
			description: '상품명 : 스타벅스 기프티콘',
			imageUrl: 'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
			link: {
			  mobileWebUrl: url,
			  webUrl: url,
			},
		  },
		  buttons: [
			{
			  title: 'e쿠폰받기',
			  link: {
				mobileWebUrl: url,
				webUrl: url,
			  },
			},
		  ],
		});
	  };

    return (
		<div className="share-node" onClick={shareKakao}>
            <img src="https://res.cloudinary.com/dv8img/image/upload/v1657238153/web/playstore_rkxg9n.png" width="100" alt="카카오공유" />
            <p>카톡</p>
        </div>
    );
  }
  

  export default WriteMain;  