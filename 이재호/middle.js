const selector = document.getElementById('wallpaper-selector');
const options = document.getElementById('wallpaper-options');
const actionButtons = document.getElementById('action-buttons');
const uploadBtn = document.getElementById('upload-btn');
const resetBtn = document.getElementById('reset-btn');
const darkmodeToggle = document.getElementById('darkmode-toggle');
let isDarkMode = false;
let isOptionsVisible = false; // 상태 변수 추가

// Local Storage에서 배경화면 불러오기
document.addEventListener('DOMContentLoaded', () => {
  const savedBackground = localStorage.getItem('backgroundImage');
  if (savedBackground) {
    document.body.style.backgroundImage = `url(${savedBackground})`;
  }

  loadCategories(); // 로컬 스토리지에서 카테고리 불러오기
});

// 배경화면 선택 버튼 클릭 시 목록 및 액션 버튼 보이기/숨기기
selector.addEventListener('click', () => {
  isOptionsVisible = !isOptionsVisible; // 상태 반전

  if (isOptionsVisible) {
    options.classList.remove('hidden'); // 미리보기 창 보이기
    actionButtons.classList.remove('hidden'); // 액션 버튼 보이기
  } else {
    options.classList.add('hidden'); // 미리보기 창 숨기기
    actionButtons.classList.add('hidden'); // 액션 버튼 숨기기
  }
});

// 배경화면 클릭 시 변경 및 Local Storage에 저장
options.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    const imageUrl = e.target.src;
    document.body.style.backgroundImage = `url(${imageUrl})`;
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

// To-Do 리스트 스크립트
let categories = [];

function addCategory() {
  const categoryInput = document.querySelector('#category-input');
  const categoryName = categoryInput.value.trim();
  if (categoryName === '') {
    alert("카테고리 이름을 입력해주세요");
    return;
  }

  const category = {
    id: Date.now(),
    name: categoryName,
    tasks: []
  };

  categories.push(category);
  renderCategory(category);
  saveCategories();
  categoryInput.value = '';
}

function renderCategory(category) {
  const categoriesContainer = document.querySelector('#categories-container');
  const categoryBox = document.createElement('div');
  categoryBox.className = 'category-box';
  categoryBox.dataset.id = category.id;

  const categoryHeader = document.createElement('h2');
  categoryHeader.textContent = category.name;

  const deleteCategoryButton = document.createElement('button');
  deleteCategoryButton.textContent = '삭제';
  deleteCategoryButton.className = 'delete-category';
  deleteCategoryButton.addEventListener('click', () => {
    deleteCategory(category.id);
  });

  categoryHeader.appendChild(deleteCategoryButton);
  categoryBox.appendChild(categoryHeader);

  const todoInputContainer = document.createElement('div');
  todoInputContainer.className = 'todo-input-container';

  const todoInput = document.createElement('input');
  todoInput.type = 'text';
  todoInput.placeholder = '할 일을 입력하세요';

  const addTodoButton = document.createElement('button');
  addTodoButton.textContent = '추가';
  addTodoButton.addEventListener('click', () => {
    addTodo(category.id, todoInput.value);
  });

  todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addTodo(category.id, todoInput.value);
      todoInput.value = "";
    }
  });

  todoInputContainer.appendChild(todoInput);
  todoInputContainer.appendChild(addTodoButton);
  categoryBox.appendChild(todoInputContainer);

  const todoList = document.createElement('ul');
  todoList.id = `todo-list-${category.id}`;
  categoryBox.appendChild(todoList);

  categoriesContainer.appendChild(categoryBox);
}

function addTodo(categoryId, todoText) {
  const trimmedText = todoText.trim();
  if (trimmedText === '') {
    alert("할 일을 입력해주세요");
    return;
  }

  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return;

  const task = {
    id: Date.now(),
    text: trimmedText
  };

  category.tasks.push(task);
  renderTodo(categoryId, task);
  saveCategories();
}

function renderTodo(categoryId, task) {
  const todoList = document.querySelector(`#todo-list-${categoryId}`);
  if (!todoList) return;

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = task.id;

  const span = document.createElement('span');
  span.textContent = task.text;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', () => {
    deleteTodo(categoryId, task.id);
  });

  li.appendChild(span);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

function deleteCategory(categoryId) {
  categories = categories.filter(cat => cat.id !== categoryId);
  const categoryBox = document.querySelector(`.category-box[data-id='${categoryId}']`);
  if (categoryBox) {
    const categoriesContainer = document.querySelector('#categories-container');
    categoriesContainer.removeChild(categoryBox);
  }
  saveCategories();
}

function deleteTodo(categoryId, taskId) {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return;

  category.tasks = category.tasks.filter(task => task.id !== taskId);
  const todoItem = document.querySelector(`.category-box[data-id='${categoryId}'] .todo-item[data-id='${taskId}']`);
  if (todoItem) {
    const todoList = document.querySelector(`#todo-list-${categoryId}`);
    todoList.removeChild(todoItem);
  }
  saveCategories();
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function loadCategories() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
    categories.forEach(category => {
      renderCategory(category);
      category.tasks.forEach(task => {
        renderTodo(category.id, task);
      });
    });
  }
}

// 이벤트 리스너
document.querySelector('#add-category-button').addEventListener('click', addCategory);
document.querySelector('#category-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addCategory();
  }
});
