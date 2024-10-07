const selector = document.getElementById('wallpaper-selector');
const options = document.getElementById('wallpaper-options');
const actionButtons = document.getElementById('action-buttons');
const uploadBtn = document.getElementById('upload-btn');
const resetBtn = document.getElementById('reset-btn');
const darkmodeToggle = document.getElementById('darkmode-toggle');
let isDarkMode = false;
let isVisible = false;

// Local Storage에서 배경화면 불러오기
document.addEventListener('DOMContentLoaded', () => {
  const savedBackground = localStorage.getItem('backgroundImage');
  if (savedBackground) {
    document.body.style.backgroundImage = `url(${savedBackground})`;
  }
});

// 배경화면 선택 버튼 클릭 시 목록 및 액션 버튼 보이기/숨기기
selector.addEventListener('click', () => {
  isVisible = !isVisible;  // 상태 반전

  if (isVisible) {
    options.style.display = 'flex';
    actionButtons.style.display = 'flex';
  } else {
    options.style.display = 'none';
    actionButtons.style.display = 'none';
  }
});

// 배경화면 클릭 시 변경 및 Local Storage에 저장
options.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    const imageUrl = e.target.src;
    document.body.style.backgroundImage = `url(${imageUrl})`;

    // Local Storage에 배경화면 URL 저장
    localStorage.setItem('backgroundImage', imageUrl);
  }
});

// 배경화면 삭제 버튼 클릭 시 배경화면 초기화 및 Local Storage에서 삭제
resetBtn.addEventListener('click', () => {
  document.body.style.backgroundImage = '';
  localStorage.removeItem('backgroundImage');
});

// 사용자 이미지 업로드 시 배경화면 목록에 추가 및 Local Storage에 저장
uploadBtn.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      options.appendChild(img);

      // 이미지 클릭 시 로컬 저장소에 추가된 이미지를 저장
      img.addEventListener('click', () => {
        document.body.style.backgroundImage = `url(${e.target.result})`;
        localStorage.setItem('backgroundImage', e.target.result);
      });
    };
    reader.readAsDataURL(file);
  }
});

// 다크모드 전환 버튼 클릭 시 다크모드/라이트모드 전환
darkmodeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkmodeToggle.textContent = isDarkMode ? '라이트모드 전환' : '다크모드 전환';
});
