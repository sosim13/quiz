import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { authService, firebaseInstance  } from './../FireBase';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import { IconContext } from "react-icons";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

function Alarm({ user, history }) {
	
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  const ss_reg_id = window.sessionStorage.getItem('ss_reg_id');
  const ss_reg_type = window.sessionStorage.getItem('ss_reg_type');
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');

  const [datas, setDatas] = useState([]);
  const [email, setEmail] = useState(ss_account);
  const alarmRef = firebase.database().ref('member_alarm');

  
  const memberRef = firebase.database().ref('member_list');

  const [push, setPush] = useState('ON');
  const [naver, setNaver] = useState('ON');
  const [cashslid, setCashslid] = useState('ON');
  const [livemate, setLivemate] = useState('ON');
  const [shinhanplay, setShinhanplay] = useState('ON');
  const [honeyscreen, setHoneyscreen] = useState('ON');
  const [counseller, setCounseller] = useState('ON');
  const [kakaopage, setKakaopage] = useState('ON');
  const [okcashbag, setOkcashbag] = useState('ON');
  const [timespred, setTimespred] = useState('ON');
  const [woori, setWoori] = useState('ON');
  const [action, setAction] = useState('ON');
  const [myhomeplus, setMyhomeplus] = useState('ON');
  const [kyobo, setKyobo] = useState('ON');
  const [carenow, setCarenow] = useState('ON');
  const [cashwork, setCashwork] = useState('ON');
  const [toss, setToss] = useState('ON');
  const [shinhanssol, setShinhanssol] = useState('ON');
  const [hpoint, setHpoint] = useState('ON');
  const [oligo, setOligo] = useState('ON');
  const [adapter, setAdapter] = useState('ON');
  const [pannelnow, setPannelnow] = useState('ON');
  const [yes24, setYes24] = useState('ON');
  const [etc, setEtc] = useState('ON');
  const [reg_id, setReg_id] = useState('');
  const [defaultId, setDefaultId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
	memberRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const mems = snapshot.val();
      for(let id in mems) {
		setReg_id(mems[id].reg_id);
      }
    })

    alarmRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		setDefaultId(id);
		setNaver(users[id].naver);
		setCashslid(users[id].cashslid);
		setLivemate(users[id].livemate);
		setShinhanplay(users[id].shinhanplay);
		setHoneyscreen(users[id].honeyscreen);
		setCounseller(users[id].counseller);
		setKakaopage(users[id].kakaopage);
		setOkcashbag(users[id].okcashbag);
		setTimespred(users[id].timespred);
		setWoori(users[id].woori);
		setAction(users[id].action);
		setMyhomeplus(users[id].myhomeplus);
		setKyobo(users[id].kyobo);
		setCarenow(users[id].carenow);
		setCashwork(users[id].cashwork);
		setToss(users[id].toss);
		setShinhanssol(users[id].shinhanssol);
		setHpoint(users[id].hpoint);
		setOligo(users[id].oligo);
		setYes24(users[id].yes24);
		setAdapter(users[id].adapter);
		setPannelnow(users[id].pannelnow);
		setEtc(users[id].etc);
      }
      setDatas(usersData);
	  setLoading(true);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'nickName' ? setEmail(ss_account) : setEmail(ss_account);
  }

  const onAlarmAdd = () => {

//	if(reg_id == null){
//		alert("세션이 끊어졌거나 기기 아이디가 없습니다. \n앱에서 다시로그인해주세요.");
//		return;
//	}
			  
    const alarmData = { email, push, reg_id, naver, cashslid, livemate, shinhanplay, honeyscreen, counseller, kakaopage, okcashbag, timespred, woori, action, myhomeplus, kyobo, carenow, cashwork, toss, shinhanssol, hpoint, oligo, yes24, adapter, pannelnow, etc  };


    alarmRef.push(alarmData);
    ToastsStore.success("알림이 설정되었습니다.");
	setTimeout(function(){
		window.location.replace("/Alarm");
	}, 1000);	
  }

  const onAlarmRemove = (id) => {
    alarmRef.child(id).remove();   
    ToastsStore.success("알림이 해제되었습니다.");
	setTimeout(function(){
		window.location.replace("/Alarm");
	}, 1000);
	
  }

  const setState = (name, value) => {
	  if(name == 'naver'){ setNaver(value) }
	  if(name == 'cashslid'){ setCashslid(value) }
	  if(name == 'livemate'){ setLivemate(value) }
	  if(name == 'shinhanplay'){ setShinhanplay(value) }
	  if(name == 'honeyscreen'){ setHoneyscreen(value) }
	  if(name == 'counseller'){ setCounseller(value) }
	  if(name == 'kakaopage'){ setKakaopage(value) }
	  if(name == 'okcashbag'){ setOkcashbag(value) }
	  if(name == 'timespred'){ setTimespred(value) }
	  if(name == 'woori'){ setWoori(value) }
	  if(name == 'action'){ setAction(value) }
	  if(name == 'myhomeplus'){ setMyhomeplus(value) }
	  if(name == 'kyobo'){ setKyobo(value) }
	  if(name == 'carenow'){ setCarenow(value) }
	  if(name == 'cashwork'){ setCashwork(value) }
	  if(name == 'toss'){ setToss(value) }
	  if(name == 'shinhanssol'){ setShinhanssol(value) }
	  if(name == 'hpoint'){ setHpoint(value) }
	  if(name == 'oligo'){ setOligo(value) }
	  if(name == 'adapter'){ setAdapter(value) }
	  if(name == 'pannelnow'){ setPannelnow(value) }
	  if(name == 'yes24'){ setYes24(value) }
	  if(name == 'etc'){ setEtc(value) }
  }

  const onUpdate = (id) => {
	if(id == ''){
		ToastsStore.success("오류가 발생하였습니다. 잠시후에 다시 시도해주세요.");
		return false;
	}
    const [data] = datas.filter(el => el.id === id);
    alarmRef.child(id).update({
		push:push,
		naver:naver,
		cashslid:cashslid,
		livemate:livemate,
		shinhanplay:shinhanplay,
		honeyscreen:honeyscreen,
		counseller:counseller,
		kakaopage:kakaopage,
		okcashbag:okcashbag,
		timespred:timespred,
		woori:woori,
		action:action,
		myhomeplus:myhomeplus,
		kyobo:kyobo,
		carenow:carenow,
		cashwork:cashwork,
		toss:toss,
		shinhanssol:shinhanssol,
		hpoint:hpoint,
		oligo:oligo,
		yes24:yes24,
		etc:etc
    });
	    
    ToastsStore.success("수정했습니다.");
  };

  

  return (
	<section>
	{loading ? 
    <div className='mybox'>
      <h1>푸시알림설정</h1>	  
	  <div>
			<div className='row'>
			  <span><b>푸시알림</b></span>
			  <div className='toggle' type="text">
			  {datas.length > 0 ? (
				<div onClick={() => {onAlarmRemove(defaultId)}}><IconContext.Provider value={{ className: 'icon-option' }}><BsToggleOn  size="30"/></IconContext.Provider></div>
			  ) : (
				<div onClick={onAlarmAdd}><IconContext.Provider value={{ className: 'icon-option' }}><BsToggleOff  size="30"/></IconContext.Provider></div>
			  )}
			  </div>
			</div>	
		    {datas?.map((data, i) => <div  className='row' key={i}>
			  <div className="push_alarm">
			  {naver == 'ON' ? (
				<><input type="checkbox" name="naver" value={naver} defaultChecked onChange={() => {setState('naver','')}} /> 네이버<br/></>
			  ) : (
				<><input type="checkbox" name="naver" value={naver}  onChange={() => {setState('naver','ON')}} /> 네이버<br/></>
			  )}				
			  {cashslid == 'ON' ? (
				<><input type="checkbox" name="cashslid" value={cashslid} defaultChecked onChange={() => {setState('cashslid','')}}  /> 캐시슬라이드<br/></>
			  ) : (
				<><input type="checkbox" name="cashslid" value={cashslid} onChange={() => {setState('cashslid','ON')}}  /> 캐시슬라이드<br/></>
			  )}				
			  {livemate == 'ON' ? (
				<><input type="checkbox" name="livemate" value={livemate} defaultChecked onChange={() => {setState('livemate','')}}  /> 리브메이트<br/></>
			  ) : (
				<><input type="checkbox" name="livemate" value={livemate} onChange={() => {setState('livemate','ON')}}  /> 리브메이트<br/></>
			  )}				
			  {shinhanplay == 'ON' ? (
				<><input type="checkbox" name="shinhanplay" value={shinhanplay} defaultChecked onChange={() => {setState('shinhanplay','')}}  /> 신한플레이<br/></>
			  ) : (
				<><input type="checkbox" name="shinhanplay" value={shinhanplay} onChange={() => {setState('shinhanplay','ON')}}  /> 신한플레이<br/></>
			  )}				
			  {honeyscreen == 'ON' ? (
				<><input type="checkbox" name="honeyscreen" value={honeyscreen} defaultChecked onChange={() => {setState('honeyscreen','')}}  /> 허니스크린<br/></>
			  ) : (
				<><input type="checkbox" name="honeyscreen" value={honeyscreen} onChange={() => {setState('honeyscreen','ON')}}  /> 허니스크린<br/></>
			  )}				
			  {counseller == 'ON' ? (
				<><input type="checkbox" name="counseller" value={counseller} defaultChecked onChange={() => {setState('counseller','')}}  /> 카운셀러<br/></>
			  ) : (
				<><input type="checkbox" name="counseller" value={counseller} onChange={() => {setState('counseller','ON')}}  /> 카운셀러<br/></>
			  )}				
			  {kakaopage == 'ON' ? (
				<><input type="checkbox" name="kakaopage" value={kakaopage} defaultChecked onChange={() => {setState('kakaopage','')}} /> 카카오페이지<br/></>
			  ) : (
				<><input type="checkbox" name="kakaopage" value={kakaopage} onChange={() => {setState('kakaopage','ON')}}  /> 카카오페이지<br/></>
			  )}							
			  {adapter == 'ON' ? (
				<><input type="checkbox" name="adapter" value={adapter} defaultChecked onChange={() => {setState('adapter','')}}  /> 어댑터<br/></>
			  ) : (
				<><input type="checkbox" name="adapter" value={adapter} onChange={() => {setState('adapter','ON')}}  /> 어댑터<br/></>
			  )}
			  </div>
			  <div className="push_alarm2">							
			  {okcashbag == 'ON' ? (
				<><input type="checkbox" name="okcashbag" value={okcashbag} defaultChecked onChange={() => {setState('okcashbag','')}}  /> 오케이캐시백<br/></>
			  ) : (
				<><input type="checkbox" name="okcashbag" value={okcashbag} onChange={() => {setState('okcashbag','ON')}}  /> 오케이캐시백<br/></>
			  )}							
			  {timespred == 'ON' ? (
				<><input type="checkbox" name="timespred" value={timespred} defaultChecked onChange={() => {setState('timespred','')}}  /> 타임스프레드<br/></>
			  ) : (
				<><input type="checkbox" name="timespred" value={timespred} onChange={() => {setState('timespred','ON')}}  /> 타임스프레드<br/></>
			  )}							
			  {woori == 'ON' ? (
				<><input type="checkbox" name="woori" value={woori} defaultChecked onChange={() => {setState('woori','')}}  /> 우리WON멤버스<br/></>
			  ) : (
				<><input type="checkbox" name="woori" value={woori} onChange={() => {setState('woori','ON')}}  /> 우리WON멤버스<br/></>
			  )}							
			  {action == 'ON' ? (
				<><input type="checkbox" name="action" value={action} defaultChecked onChange={() => {setState('action','')}}  /> 옥션<br/></>
			  ) : (
				<><input type="checkbox" name="action" value={action} onChange={() => {setState('action','ON')}}  /> 옥션<br/></>
			  )}							
			  {myhomeplus == 'ON' ? (
				<><input type="checkbox" name="myhomeplus" value={myhomeplus} defaultChecked onChange={() => {setState('myhomeplus','')}}  /> 마이홈플러스<br/></>
			  ) : (
				<><input type="checkbox" name="myhomeplus" value={myhomeplus} onChange={() => {setState('myhomeplus','ON')}}  /> 마이홈플러스<br/></>
			  )}							
			  {kyobo == 'ON' ? (
				<><input type="checkbox" name="kyobo" value={kyobo} defaultChecked onChange={() => {setState('kyobo','')}}  /> 교보문고<br/></>
			  ) : (
				<><input type="checkbox" name="kyobo" value={kyobo} onChange={() => {setState('kyobo','ON')}}  /> 교보문고<br/></>
			  )}							
			  {carenow == 'ON' ? (
				<><input type="checkbox" name="carenow" value={carenow} defaultChecked onChange={() => {setState('carenow','')}}  /> 정관장 케어나우<br/></>
			  ) : (
				<><input type="checkbox" name="carenow" value={carenow} onChange={() => {setState('carenow','ON')}}  /> 정관장 케어나우<br/></>
			  )}			  							
			  {pannelnow == 'ON' ? (
				<><input type="checkbox" name="pannelnow" value={pannelnow} defaultChecked onChange={() => {setState('pannelnow','')}}  /> 패널나우<br/></>
			  ) : (
				<><input type="checkbox" name="pannelnow" value={pannelnow} onChange={() => {setState('pannelnow','ON')}}  /> 패널나우<br/></>
			  )}
			  </div>
			  <div className="push_alarm">							
			  {cashwork == 'ON' ? (
				<><input type="checkbox" name="cashwork" value={cashwork} defaultChecked onChange={() => {setState('cashwork','')}}  /> 캐시워크<br/></>
			  ) : (
				<><input type="checkbox" name="cashwork" value={cashwork} onChange={() => {setState('cashwork','ON')}}  /> 캐시워크<br/></>
			  )}						
			  {toss == 'ON' ? (
				<><input type="checkbox" name="toss" value={toss} defaultChecked onChange={() => {setState('toss','')}}  /> 토스<br/>	</>
			  ) : (
				<><input type="checkbox" name="toss" value={toss} onChange={() => {setState('toss','ON')}}  /> 토스<br/>	</>
			  )}							
			  {shinhanssol == 'ON' ? (
				<><input type="checkbox" name="shinhanssol" value={shinhanssol} defaultChecked onChange={() => {setState('shinhanssol','')}}  /> 신한쏠<br/></>
			  ) : (
				<><input type="checkbox" name="shinhanssol" value={shinhanssol} onChange={() => {setState('shinhanssol','ON')}}  /> 신한쏠<br/></>
			  )}							
			  {hpoint == 'ON' ? (
				<><input type="checkbox" name="hpoint" value={hpoint} defaultChecked onChange={() => {setState('hpoint','')}}  /> H.POINT<br/></>
			  ) : (
				<><input type="checkbox" name="hpoint" value={hpoint} onChange={() => {setState('hpoint','ON')}}  /> H.POINT<br/></>
			  )}							
			  {oligo == 'ON' ? (
				<><input type="checkbox" name="oligo" value={oligo} defaultChecked onChange={() => {setState('oligo','')}}  /> 올리고<br/></>
			  ) : (
				<><input type="checkbox" name="oligo" value={oligo} onChange={() => {setState('oligo','ON')}}  /> 올리고<br/></>
			  )}							
			  {yes24 == 'ON' ? (
				<><input type="checkbox" name="yes24" value={yes24} defaultChecked onChange={() => {setState('yes24','')}}  /> 예스24<br/></>
			  ) : (
				<><input type="checkbox" name="yes24" value={yes24} onChange={() => {setState('yes24','ON')}}  /> 예스24<br/></>
			  )}
			  {etc == 'ON' ? (
				<><input type="checkbox" name="etc" value={etc} defaultChecked onChange={() => {setState('etc','')}}  /> 기타<br/></>
			  ) : (
				<><input type="checkbox" name="etc" value={etc} onChange={() => {setState('etc','ON')}}  /> 기타<br/></>
			  )}
			  </div>
			</div>	
			)}			
			<div className='row'>
			  <button className='save' onClick={() => {onUpdate(defaultId)}}>
				수정하기
			  </button>
			  <button className='logout' type="button" onClick={() => history.goBack()}>
				취소하기
			  </button>
			</div>
        </div>
     
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
	: '' }
	</section>
  );
}

export default Alarm;