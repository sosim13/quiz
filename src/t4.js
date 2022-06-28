// 지도 테스트
import React, { useEffect, useState } from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Marker, Service, searchAddressToCoordinate } from 'react-naver-maps'; // 패키지 불러오기


function NaverMapAPI() {
  
  const navermaps = window.naver.maps;
  const [addrs, setAddrs] = useState('');

   const [{ lat, lng }, setGeometricData] = useState({
        lat: 37.554722,
        lng: 126.988205,
    });

    const searchAddressToCoordinate = (address) => {
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

  const onChange = (e) => {
    e.target.name === 'addrs' ? setAddrs(e.target.value) : setAddrs(e.target.value) ;
  }

  useEffect(() => {
//	    
	setTimeout(function(){
		searchAddressToCoordinate(document.getElementById("addrs").value);
	}, 2000);
  }, []);


  return (
	  <div>
    <NaverMap
  mapDivId={"maps-getting-started-uncontrolled"} // default: react-naver-map
  style={{
    width: "100%", // 네이버지도 가로 길이
    height: "40vh", // 네이버지도 세로 길이 80
  }}
  center={{ lat: lat, lng: lng }} // 지도 위치 (동적으로 변경)
  defaultZoom={13} // 지도 초기 확대 배율
>
  <Marker
    key={1}
    position={new navermaps.LatLng(lat, lng)}
    animation={2}
    onClick={() => {
      alert("여기는 N서울타워입니다.");
    }}
  />
</NaverMap>;
		  
		<div onClick={() => getLocation()}>내위치</div>
		<div onClick={() => searchAddressToCoordinate(document.getElementById("addrs").value)}>주소검색</div>
			<input type="text" name="addrs" id="addrs" value={addrs} />
		  </div>
  );
}

  
//latitude: 37.4835385
//longitude: 127.1222224

const T4 = () => {
  const gogo = () => {
		document.getElementById("addrs").value = '양천구 신정로 293';
  }

   useEffect(() => {
//	    
	setTimeout(function(){
		gogo();
	}, 1000);
  }, []);

  return (
	  <div>
    <RenderAfterNavermapsLoaded
      ncpClientId={process.env.REACT_APP_NAVER_MAP_NCPCLIENTID} // 자신의 네이버 계정에서 발급받은 Client ID
      error={<p>Maps Load Error</p>}
      loading={<p>Maps Loading...</p>}
      submodules={["geocoder"]}
    >
      <NaverMapAPI />
    </RenderAfterNavermapsLoaded>
	<div onClick={() => gogo()}>321321</div>
		<div></div>
		</div>
  );
}

export default T4;