let groceryList = [];

const groceryItemsList = document.querySelector('#listItem');

const userForm = document.querySelector('.userForm');

userForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addGetUser();
});

const groceryItemForm = document.querySelector('.groceryItemForm');

const groceryItemInput = document.querySelector('.groceryItemInput');

groceryItemForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addItem(groceryItemInput.value);
    groceryItemInput.value = '';
});

const editItemForm = document.querySelector('.editItemForm');

const itemValue = document.querySelector('.itemValue');
const itemId = document.querySelector('.itemId');

editItemForm.addEventListener('submit', function(event) {
    event.preventDefault();
    saveItem(itemValue.value,itemId.value);
    itemValue.value = '';
});

const userSection = document.getElementById("userSection");

const listSection = document.getElementById("listSection");

const logoutButton = document.getElementById("logout");

const editSection = document.getElementById("editSection");

let sessionUserName; 

checkUser();

function checkUser(){
    sessionUserName = sessionStorage.getItem('userName');
    if(sessionUserName){
        listSection.style.display = "block";
        logoutButton.style.display = "block";
        userSection.style.display = "none";
        let groceryListFromStorage = localStorage.getItem(sessionUserName);
        if(groceryListFromStorage!==''){
            groceryListFromStorage = JSON.parse(groceryListFromStorage);
            for(var i in groceryListFromStorage)
            groceryList.push(groceryListFromStorage [i]);
            renderList(groceryList);
        }
    } else {
        userSection.style.display = "block";
        listSection.style.display = "none";
        logoutButton.style.display = "none";
    }
}

function addGetUser() {
    const userName = document.getElementById('userName').value;

    if (userName === '') {
        alert('Please enter a user name');
    }
    else {
        sessionStorage.setItem('userName',userName);
        let userGroceryList = localStorage.getItem(userName);
        if (userGroceryList !== null) {
            checkUser(); 
        } else {
            localStorage.setItem(userName,'');
            checkUser(); 
        }  
    }
}

function addItem(groceryItem) {
    if(groceryItem!==''){
        const list = {
            id: Date.now(),
            groceryItem: groceryItem
        }
        groceryList.push(list);
        //console.log(groceryList);
        addToLocalStorage(groceryList);
    }
    else{
        alert('Please enter a item');
    }
}

function saveItem(itemValue, itemId) {
    if(itemValue !== '' && itemId !== ''){
        //console.log(itemValue,itemId,groceryList);
        for (var i in groceryList) {
            if (groceryList[i].id == itemId) {
                groceryList[i].groceryItem = itemValue;
               break;
            }
        }
        addToLocalStorage(groceryList);
        listSection.style.display = "block";
        editSection.style.display = "none";
    } else {
        alert('please enter something')
    }
}

function addToLocalStorage(groceryList) {
    sessionUserName = sessionStorage.getItem('userName');
    localStorage.setItem(sessionUserName, JSON.stringify(groceryList));
    renderList(groceryList);
}

function getFromLocalStorage() {
    sessionUserName = sessionStorage.getItem('userName');
    groceryList = localStorage.getItem(sessionUserName);
    if(groceryList!==''){
        renderList(JSON.parse(groceryList));
    }
}

function renderList(groceryList) {
    groceryItemsList.innerHTML = '';
  
    groceryList.forEach(function(groceryItem) {
  
      const li = document.createElement('li');
      li.setAttribute('data-key', groceryItem.id);
      li.setAttribute('class', 'groceryItem');
      li.setAttribute('data-key', groceryItem.id);
      
      li.innerHTML = `
        ${groceryItem.groceryItem}
        <button class="editButton actionButton">edit</button>
        <button class="deleteButton actionButton">X</button>
      `;
      groceryItemsList.append(li);
    }); 
}

listSection.addEventListener('click', function(event) {
    if (event.target.classList.contains('editButton')) {
        editItem(event.target.parentElement.getAttribute('data-key'));
    }
  
    if (event.target.classList.contains('deleteButton')) {
        deleteItem(event.target.parentElement.getAttribute('data-key'));
    }
});

function deleteItem(id) {
    groceryList = groceryList.filter(function(item) {
      return item.id != id;
    });
    addToLocalStorage(groceryList);
}

function editItem(id) {
    let editItemDetails = groceryList.find(function(item) {
      return item.id == id;
    });

    itemValue.value = editItemDetails.groceryItem;
    itemId.value = editItemDetails.id;
    listSection.style.display = "none";
    editSection.style.display = "block";
    //console.log(editItemDetails.groceryItem);
}

logoutButton.addEventListener('click', function(event) {
    logout();
});

function logout() {
    sessionStorage.removeItem('userName');
    location.reload();
}