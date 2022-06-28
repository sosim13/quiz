import React, { useState } from 'react';


const Manual = () => {

  return (
	  <div>
		<section>
			<div className="banner">
				<b>CRANBBERY 메뉴얼</b><br/><br/>
	            1. promotion<br/>
				이 게시판은 홍보 게시판 입니다.<br/>
				내 인스타그램이나 틱톡, 유튜브 등을 홍보할 수 있고 홍보시 포인트가 차감됩니다.<br/><br/>
				2. Quiz<br/>
				토스, 오퀴즈, 캐시워크등의 앱에서 하는 퀴즈 이벤트 정답을 공유하는 게시판입니다.<br/><br/>
	  3. 영수증 리뷰<br/>
		영수증 올리고 리뷰하는 게시판 입니다. <br/>
	  다른사람들과 맛집을 공유해보세요.<br/><br/>
	  4. 자유게시판<br/>
	  이 게시판은 자유게시판입니다.<br/>
	  자유롭게 하고 싶은 얘기를 공유해보세요.<br/><br/>
	  5. 마이페이지<br/>
	  내 정보를 관리하는 페이지 입니다.<br/>
	  다른 게시판에 글을 쓰려면 마이페이지에서 닉네임을 설정해주세요.<br/>
	  닉네임이 없으면 글을 쓸수가 없어요.<br/>
	  게시판 활동하면서 모은 포인트도 확인 하실 수 있습니다.<br/><br/>
	  *포인트<br/>
	  출석체크를 하시면 포인트를 얻을 수 있습니다.<br/>
	  포인트는 퀴즈 정답공유를 하거나 영수증 리뷰, 신고등을 통해 얻을 수 있어요.<br/>
	  모은 포인트로 내 SNS계정이나 사이트를 홍보해 보세요.<br/>

			</div>
				<button className='grayBtn' onClick={() => window.location.replace("/")}>목록</button>
		</section>
	  </div>
  );
}

export default Manual;