import React, { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import './common/index.css';

const Card = () => {
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////    div 이미지로 저장 테스트                                                                 //////
//////////////////////////////////////////////////////////////////////////////////////////////////////
  const cardRef = useRef();
  const onDownloadBtn = () => {
    const card = cardRef.current;
    const filter = (card) => {
      return card.tagName !== 'BUTTON';
    };
    domtoimage
      .toBlob(card, { filter: filter })
      .then((blob) => {
        saveAs(blob, 'card.png');
      });
  };

  return (
	<>
		<div ref={cardRef} className='test_box'>
		  <div className='test_box2'>
			<img src="https://res.cloudinary.com/dv8img/image/upload/r_50/v1671608184/use_img/startbucks.png" />
		  </div>
		  <h1>스타벅스</h1>
	      <div>
	        카페 아메리카노 T
	      </div>
	      <div>
	        유효기간 : 2023년 02월 11일
	      </div>
	      <div>
	        바코드
	      </div>
	      <div>
	        바코드번호
	      </div>
      <button className='downBtn' onClick={onDownloadBtn}>
      다운로드 버튼
      </button>
		</div>
		
	</>
  );
};

export default Card;