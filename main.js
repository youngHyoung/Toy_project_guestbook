async function loadGuestbook() {
  try{
    const response = await fetch("http://52.79.131.217:8000/guestbook/",{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    const responseContainer = document.getElementById('response-container');
    const result = await response.json();
    
    result.data.forEach(data => {
      const written = document.createElement('div');
      written.className = 'written';
      written.dataset.id = data.id;
      
      written.innerHTML = `
      <p><strong>😁제목:</strong> ${data.title || '미지정'}</p>
      <p><strong>🔖이름:</strong> ${data.name || '미지정'}</p>
      <p><strong>✍️내용입력:</strong> ${data.content || '미지정'}</p>
      <p><strong>🌱방문일:</strong> ${data.created.slice(0, 10) || '미지정'}</p>
      <p><strong>🤐비밀번호:</strong> <input type="text" class="password" name="password" placeholder="****" required></p>
      <button class="del-button">삭제하기</button> 
      `;

      const deleteButton = written.querySelector('.del-button');
      deleteButton.addEventListener('click', async () =>{
      const passwordInput = written.querySelector('.password');
      const password = passwordInput.value;

      try {
        const deleteResponse = await fetch(`http://52.79.131.217:8000/guestbook/`,{
          method: "DELETE",
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            id: String(data.id),
            password,
          })
        });

        if (!deleteResponse.ok) { // 삭제 실패시 throw Error해서 written,remove 구문 건너뜀뜀
          const errorMessage = await deleteResponse.text();
          alert('비밀번호가 틀렸습니다!')
          throw new Error(errorMessage.error)
        }

        written.remove();
        alert('방명록 삭제 완료')

      } catch (e) {
        console.log('오류 발생')
        console.log(e.message);
      }
    });
      responseContainer.appendChild(written);
    });

} catch (e) {
    console.error('방명록 로드 오류:', e.message)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGuestbook(); // 초기 목록 로드
});


//POST하기
document.getElementById("form").addEventListener('submit', async function(event) {
  event.preventDefault();
  const form = event.target //form 요소 타겟
  const formData = new FormData(form) // form 요소 객체로 변환

  const formToJson = {};
  formData.forEach((value, key) => {
    formToJson[key] = value;
  });
  
  try{
    const response = await fetch("http://52.79.131.217:8000/guestbook/", {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json', //해더 옵션 설정
      },
      body: JSON.stringify(formToJson),  //객체를 JSON 문자열로 변환
    })
    
   if (!response.ok) {
    throw new Error(`서버 응답 오류: ${response.status}`);
  }
  
  const result = await response.json(); 
  console.log(result); // 데이터 받은 값 확인하기

  await loadGuestbook(); // 목록 전체 갱신

} catch(e) {
  console.log('오류 발생')
  console.log(e.message);
  }
});



