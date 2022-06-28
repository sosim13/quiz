import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import { RenderAfterNavermapsLoaded, NaverMap, Marker, Service, searchAddressToCoordinate } from 'react-naver-maps'; // 패키지 불러오기
import { AiFillEnvironment } from "react-icons/ai";

function NaverMapAPI() {
  
  const navermaps = window.naver.maps;

   const [{ lat, lng }, setGeometricData] = useState({
        lat: 37.554722,
        lng: 126.988205,
    });

  const [isOpen, setMenu] = useState(false);  // 메뉴의 초기값을 false로 설정
  const toggleMenu = () => {
	setMenu(isOpen => !isOpen); // on,off 개념 boolean
  }

    const searchAddressToCoordinate = (address) => {
		console.log(address);
        navermaps.Service.geocode(
            {
                query: address,
            },
            function (status, response) {
				console.log(response);
                if (status === navermaps.Service.Status.ERROR) {
                    if (!address) {
                        return alert('Geocode Error, Please check address');
                    }
                    return alert('Geocode Error, address:' + address);
                }

                if (response.v2.meta.totalCount === 0) {
                    return alert('No result.');
                }

                let item = response.v2.addresses[0];
                setGeometricData({
                    lng: item.x,
                    lat: item.y,
                });

				console.log(item.x);
				console.log(item.y);
            },
        );
    };

	const getLocation = () => {

    if (navigator.geolocation) { // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(function (position) {
//          console.log(position.coords); // lat lng을 통해 좌표값을 얻어옵니다.
		  
          console.log(position.coords.latitude, position.coords.longitude); // lat lng을 통해 좌표값을 얻어옵니다.
		  setGeometricData({
                    lng: position.coords.longitude,
                    lat: position.coords.latitude,
                });

//		  position={new navermaps.LatLng(position.coords.latitude, position.coords.latitude)}
//        const navermaps = window.naver.maps;
//        this.setState(() => ({ center : new navermaps.LatLng(34.9070498, 128.6521583) }));

//		  this.setState(() => ({ center : new navermaps.LatLng(position.coords.longitude, position.coords.latitude) }));
      }, function (error) {
        console.error(error);
      }, {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity
      });
    } else {
      alert('NoGPS');
    }
  }


	 setTimeout(function(){
		if(document.getElementById("addrs").value != ''){
			searchAddressToCoordinate(document.getElementById("addrs").value);
			setMenu(true);
		}
	}, 1000);
	

  return (
	  <div className={isOpen ? "billMap" : "hide_content"} align="center">
	{/*<div onClick={() => searchAddressToCoordinate(document.getElementById("addrs").value)}><AiFillEnvironment/>[지도보기]</div>*/}
	  <input type="hidden" name="addrs" id="addrs" value="" readOnly />
    <NaverMap
  mapDivId={"maps-getting-started-uncontrolled"} // default: react-naver-map
  style={{
    width: "90%", // 네이버지도 가로 길이
    height: "30vh", // 네이버지도 세로 길이 80
  }}
  center={{ lat: lat, lng: lng }} // 지도 위치 (동적으로 변경)
  defaultZoom={18} // 지도 초기 확대 배율
>
  <Marker
    key={1}
    position={new navermaps.LatLng(lat, lng)}
    animation={2}
    onClick={() => {
//      alert("여기는 N서울타워입니다.");
    }}
  />
</NaverMap>
		  </div>
  );
}

const BillDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  const [memDatas, setMemDatas] = useState([]);
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [memNickName, setMemNickName] = useState('');
  const [memPoint, setMemPoint] = useState('');
  const memberRef = firebase.database().ref('member_list');

  useEffect(() => {
    memberRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const mems = snapshot.val();
      const memData = [];
      for(let id in mems) {
        memData.push({ ...mems[id], id });
		setMemFirebaseId(id);
		setMemNickName(mems[id].nickName);
		setMemPoint(mems[id].point);
      }
  
      setMemDatas(memberRef);
    })
  }, []);
  
  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [addr, setAddr] = useState('');
  const [email, setEmail] = useState('');
  const [nowPhoto, setNowPhoto] = useState('');
  const userRef = firebase.database().ref('billList');
  const [myData, setMyData] = useState(0);
  const [photoCnt, setPhotoCnt] = useState(0);

  useEffect(() => {
    userRef.orderByKey().equalTo(match.params.id).once('value', snapshot => {
      const users = snapshot.val();
	  console.log(snapshot.val());
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		{users[id].email == ss_account && setMyData(1) }
		
	    {users[id].photo2 != '' && setPhotoCnt(1) }
		{users[id].photo3 != '' && setPhotoCnt(1) }
		{users[id].photo4 != '' && setPhotoCnt(1) }
		{users[id].photo5 != '' && setPhotoCnt(1) }
		setAddr(users[id].addr);

      }
  
      setDatas(usersData);
    })
		
  }, []);

  const onClickRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?\n(삭제하면 등록시 지급된 포인트가 차감됩니다.)")) {
		
	  // 글 삭제시 포인트 -10
      memberRef.child(memFirebaseId).update({
        point : memPoint-10
      });
	  userRef.child(id).remove();
	  ToastsStore.success("삭제되었습니다.");	  
      window.location.replace("/bill/"+match.params.page);
	}    
  }
setTimeout(function(){
	if(document.getElementById("addrs") != null){
	  console.log(document.getElementById("addrs"));
		document.getElementById("addrs").value = addr;
	}
}, 1000);
//  setTimeout(function(){

//  }, 5000);

  return (
   <>
		{datas?.map(data => <div key={data.id}>
        
	  <div>
		{/*타입: {data.type}<br />*/}
		<h4 className='board_title'>{data.company} [{data.readNo}]</h4>
		<span className='writer'>{data.nickName}</span><br/><br/>
			<span className='date'>{data.utime.substring(0,4)+'-'+data.utime.substring(4,6)+'-'+data.utime.substring(6,8)+' '+data.utime.substring(8,10)+':'+data.utime.substring(10,12)}</span><br/><br/>
			<p className=''><img src={nowPhoto == '' ? data.photo1 : nowPhoto} width="100%" /></p>
			<p className=''>
			{photoCnt > 0 ?
			<>
			{data.photo1 != '' ?
				<img src={data.photo1.replace('/upload/','/upload/c_thumb,w_86,h_63/')}  onClick={() => setNowPhoto(data.photo1)} className='imgBorder' />
			: null }
			{data.photo2 != '' ?
				<img src={data.photo2.replace('/upload/','/upload/c_thumb,w_86,h_63/')} onClick={() => setNowPhoto(data.photo2)} className='imgBorder'/>
			: null }
			{data.photo3 != '' ?
				<img src={data.photo3.replace('/upload/','/upload/c_thumb,w_86,h_63/')} onClick={() => setNowPhoto(data.photo3)} className='imgBorder'/>
            : null }
			{data.photo4 != '' ?
				<img src={data.photo4.replace('/upload/','/upload/c_thumb,w_86,h_63/')} onClick={() => setNowPhoto(data.photo4)} className='imgBorder'/>
            : null }
			{data.photo5 != '' ?
				<img src={data.photo5.replace('/upload/','/upload/c_thumb,w_86,h_63/')} onClick={() => setNowPhoto(data.photo5)} className='imgBorder'/>
			: null }
			</>
			: null }
			</p>
			<p>전화번호 : {data.tel}</p>
			<p>주소 : {data.addr}</p>
			<p>평가 : {data.star}</p>
			<p>주차 : {data.parking}</p>
			<p>추천메뉴 : {data.recommend}</p>
			<p className='board_content'>{data.content}</p>
				
            <p>
			<RenderAfterNavermapsLoaded
			  ncpClientId={process.env.REACT_APP_NAVER_MAP_NCPCLIENTID} // 자신의 네이버 계정에서 발급받은 Client ID
			  error={<p>Maps Load Error</p>}
			  loading={<p>Maps Loading...</p>}
			  submodules={["geocoder"]}
			>
			  <NaverMapAPI />
			</RenderAfterNavermapsLoaded>
		    </p>
        </div>

      </div>
		  
      )}
	  <hr/>
      <button className='grayBtn' onClick={() => window.location.replace("/bill/"+match.params.page)}>목록</button>
	{myData == 1 && <>
	  <Link to={`/bill/BillEdit/${match.params.id}/${match.params.page}`}><button className='grayBtn'> 수정</button></Link>
	  <button className='grayBtn' onClick={() => onClickRemove(match.params.id)}>삭제</button>
     </>}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </>
  );
};

export default BillDetail;