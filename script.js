function addList() {
    let title = document.getElementById("listTitle").value.trim();
    let priority = parseInt(document.getElementById("addPriority").value);
    let category = document.getElementById("addCategory").value.trim();
    let tags = document.getElementById("addTags").value.trim().split(",");
    let deadline = document.getElementById("addDeadline").value.trim();
    let items = [];
  
    let itemsElements = document.querySelectorAll(".itemsInputDiv textarea");
    for (let itemElement of itemsElements) {
      let itemValue = itemElement.value.trim();
      if (itemValue !== "") {
        items.push(itemValue);
      }
    }
  
    if (title === "") {
      alert("Title cannot be empty. Please enter a title.");
      return;
    }
  
    if (deadline === "") {
      alert("Deadline cannot be empty. Please select a deadline.");
      return;
    }
  
    let newItem = {
      title: title,
      priority: priority,
      category: category,
      tags: tags,
      deadline: deadline,
      items: items,
    };
  
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
  
    storageArray.push(newItem);
    localStorage.setItem("lists", JSON.stringify(storageArray));
  
    document.getElementById("listTitle").value = "";
    document.getElementById("addPriority").value = "3";
    document.getElementById("addCategory").value = "General";
    document.getElementById("addTags").value = "";
    document.getElementById("addDeadline").value = "";
    document.getElementById("addItemsContainer").innerHTML = "";
  
    listShow(storageArray);
  }
  
  let addItemCounter = 0;
  
  function addItem(st = "") {
    addItemCounter++;
    let addItemsContainer = document.getElementById("addItemsContainer");
    let newItem = document.createElement("div");
    newItem.classList.add("itemsInputDiv");
    newItem.id = `addItem_${addItemCounter}`;
    newItem.innerHTML = `
      <span class="item_index_count">${addItemCounter}</span>
      <textarea class="form-control" placeholder="Subtask ${addItemCounter}" style="height:1rem">${st}</textarea>
      <button class="btn btn-secondary" style="height: 38px; margin: 0px 5px 0px 10px;" onclick="removeItem(${addItemCounter})" style="font-size: 20px; font-weight: bold;">Remove</button>
      `;
    addItemsContainer.appendChild(newItem);
  }
  
  function removeItem(addItemCounter) {
    if (addItemCounter === 1) return;
  
    let addItemsContainer = document.getElementById("addItemsContainer");
    let itemToRemove = document.getElementById(`addItem_${addItemCounter}`);
    addItemsContainer.removeChild(itemToRemove);
  
    addItemCounter--;
    let items = document.querySelectorAll(".itemsInputDiv");
    items.forEach((element, index) => {
      element.querySelector("span").innerText = `${index + 1}`;
      element.querySelector("textarea").placeholder = `Type item no. ${
        index + 1
      } here`;
      element.querySelector("button").onclick = () => removeItem(index + 1);
    });
  }
  
  function listShow(inputArray = null) {
    let storageArray = [];
    if (inputArray === null) {
      let storage = localStorage.getItem("lists");
      if (storage != null) storageArray = JSON.parse(storage);
    } else {
      storageArray = inputArray;
    }
  
    let html = "";
    for (let index = 0; index < storageArray.length; index++) {
      let pri = storageArray[index].priority;
      if (pri == 1) pri = "High";
      else if (pri == 2) pri = "Medium";
      else if (pri == 3) pri = "Low";
  
      let thisdeadline = new Date(storageArray[index].deadline);
      const currentDate = new Date();
  
      html += ` 
          <div id="listCard_${index}" class="card noteCard mx-2 my-2" style="">
              <div class="card-body">
                  <div style="display: flex; justify-content: space-between;">
                      <h5 class="card-title">${storageArray[index].title}</h5>`;
  
      if (thisdeadline < currentDate) {
          html += `<h5 id="statusofList" style="color: red;">(expired)</h5>`;
      }
  
      html += `</div>
                  <div style="display: flex; justify-content: space-between;">
                      <div style="max-width:50%; padding-bottom: 10px; word-wrap: break-word;" >
                          <p class="card-text" style="margin: 0px;">Category: ${storageArray[index].category}</p>
                          <p class="card-text" style="margin: 0px;">Tags: <span>`;
      html += storageArray[index].tags.join(", ");
      html += `</span></p>
                      </div>
                      <div style="padding-bottom: 10px; text-align: right;" >
                          <p class="card-text" style="margin: 0px;">Priority: ${pri}</p>
                          <p class="card-text" style="margin: 0px; text-align:left;">Deadline: </p>
                          <p class="card-text" style="margin: 0px;">${this.formatDateTime(
                            storageArray[index].deadline
                          )}</p>
                      </div>
                  </div>
  
                  <div style="padding-bottom: 50px" >`;
  
      for (let i = 0; i < storageArray[index].items.length; i++) {
        html += `<p class="card-text"><input class="form-check-input strikeCheck" type="checkbox" onclick="strike()"><span style="width:3rem">${
          i + 1
        }.</span>  <span id="spanofItems">${
          storageArray[index].items[i]
        } </span></p>`;
      }
  
      html += `
          </div>
          <div class="threeButtons">
              <button id="markasDone" href="#" class="btn btn-success" onclick="markasDone(${index})"  style="display:inline">Mark as Done</button>
              <button id="markasUndone" href="#" class="btn btn-danger" onclick="markasUndone(${index})" style="display:none">Mark as Undone</button>
              <button href="#" class="btn btn-primary" onclick="editList(${index})" >Edit</button>
              <button href="#" class="btn btn-primary btn-danger" 
                      onclick="deleteList(${index})">Delete</button>
          </div>
          </div>
          </div> `;
    }
  
    document.getElementById("listCardsContainer").innerHTML = html;
  }
  
  function markasDone(i) {
    let listCard = document.getElementById(`listCard_${i}`);
    listCard.style = "color:gray!important; text-decoration: line-through;";
  
    let markUndone = event.target.parentNode.querySelector("#markasUndone");
    event.target.style = "display:none";
    markUndone.style = "display:inline";
    event.target.parentNode.parentNode.querySelector(
      "#statusofList"
    ).style.display = "none";
  }
  
  function strike(){
    if(event.target.checked){
        event.target.parentNode.style = "text-decoration: line-through; color: grey";
    }else{
        event.target.parentNode.style = "";
    }
}

  function markasUndone(i) {
    let listCard = document.getElementById(`listCard_${i}`);
    listCard.style = "color:black!important;";
  
    let markDone = event.target.parentNode.querySelector("#markasDone");
    event.target.style = "display:none";
    markDone.style = "display:inline";
    event.target.parentNode.parentNode.querySelector(
      "#statusofList"
    ).style.display = "inline";
  }
  
  function editList(i) {
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
  
    let titleElement = document.getElementById("listTitle");
    titleElement.value = storageArray[i].title;
  
    let priority = document.getElementById("addPriority");
    priority.value = storageArray[i].priority;
  
    let category = document.getElementById("addCategory");
    category.value = storageArray[i].category;
  
    let tagsElement = document.getElementById("addTags");
    tagsElement.value = storageArray[i].tags.join(", ");
  
    let deadline = document.getElementById("addDeadline");
    deadline.value = storageArray[i].deadline;
  
    document.getElementById("addItemsContainer").innerHTML = "";
    let addItemCounter = 0;
    for (let item of storageArray[i].items) {
      addItemCounter = addItem(addItemCounter, item);
    }
  
    deleteList(i);
    listShow();
  }
  
  function deleteList(i) {
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
    storageArray.splice(i, 1);
    localStorage.setItem("lists", JSON.stringify(storageArray));
    listShow();
  }
  
  function formatDateTime(dateVal) {
    var newDate = new Date(dateVal);
  
    function padValue(value) {
      return value < 10 ? "0" + value : value;
    }
  
    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";
  
    var iHourCheck = parseInt(sHour);
  
    if (iHourCheck > 12) {
      sAMPM = "PM";
      sHour = iHourCheck - 12;
    } else if (iHourCheck === 0) {
      sHour = "12";
    }
  
    sHour = padValue(sHour);
  
    return (
      sDay +
      "-" +
      sMonth +
      "-" +
      sYear +
      " " +
      sHour +
      ":" +
      sMinute +
      " " +
      sAMPM
    );
  }
  
  function filter() {
    let filterbyCategory = document
      .getElementById("filterbyCategory")
      .value.trim()
      .toLowerCase();
    let filterbyDeadlineFrom = new Date(
      document.getElementById("filterbyDeadlineFrom").value
    );
    let filterbyPriority = parseInt(
      document.getElementById("filterbyPriority").value
    );
    let sortBy = document.getElementById("sortBy").value;
  
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
  
    let filteredData = storageArray.filter((list) => {
      let f1, f2, f3;
  
      if (filterbyCategory === "") f1 = true;
      else f1 = list.category.toLowerCase().includes(filterbyCategory);
  
      if (
        Object.prototype.toString.call(filterbyDeadlineFrom) ===
          "[object Date]" &&
        !isNaN(filterbyDeadlineFrom.getTime())
      ) {
        f2 = new Date(list.deadline) >= filterbyDeadlineFrom;
      } else f2 = true;
  
      f3 = filterbyPriority == 0 || list.priority === filterbyPriority;
  
      return f1 && f2 && f3;
    });
  
    let sortedData = filteredData.sort((a, b) => {
      if (sortBy === "Deadline") {
        return a.deadline > b.deadline;
      } else if (sortBy === "Priority") {
        return a.priority - b.priority;
      }
    });
  
    listShow(sortedData);
  }
  
  function searchByTitleOrItems() {
    let search = document.getElementById("searchTxt").value.toLowerCase();
    let lists = document.getElementsByClassName("noteCard");
  
    Array.from(lists).forEach((list) => {
      let title = list.querySelector(".card-title").innerText.toLowerCase();
      let items = list
        .querySelector("span#spanofItems")
        .parentNode.parentNode.textContent.toLowerCase();
  
      if (title.includes(search) || items.includes(search)) {
        list.style.display = "block";
      } else {
        list.style.display = "none";
      }
    });
  }
  
  function searchByTags() {
    let searchTags = document.getElementById("searchTags").value.toLowerCase();
    let lists = document.getElementsByClassName("noteCard");
  
    Array.from(lists).forEach((list) => {
      let tags = list
        .querySelectorAll("p.card-text")[1]
        .querySelector("span")
        .textContent.toLowerCase();
  
      if (tags.includes(searchTags)) {
        list.style.display = "block";
      } else {
        list.style.display = "none";
      }
    });
  }
  
  function initPage() {
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
    listShow(storageArray);
  }
  
  initPage();
  
  setInterval(() => {
    let storageArray = [];
    let storage = localStorage.getItem("lists");
    if (storage != null) storageArray = JSON.parse(storage);
    for (let index = 0; index < storageArray.length; index++) {
        let thisdeadline = new Date(storageArray[index].deadline);
        if(thisdeadline === new Date())alert("df");
    }
  }, 500)