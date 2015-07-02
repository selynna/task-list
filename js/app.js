//Problem: User interaction doesn't provide desired results.
//Solution: Add interactivty so the user can manage daily tasks.
$('.container').hide(); 
$('.error-message').hide();
$('.successful-account-message').hide();
$('.error-create-account').hide();
var fb = new Firebase('https://test-1-sely.firebaseio.com/');
var taskInput = document.getElementById("new-task"); //new-task
var addButton = document.getElementsByTagName("button")[3]; //4th button...
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks
var username = document.getElementById("input-email"); //input-email
var password = document.getElementById("input-password"); //input-password
var loginButton = document.getElementById("sign-in-button"); //sign in button
var createAccountButton = document.getElementsByTagName("button")[2]; //3rd button

//New Task List Item
var createNewTaskElement = function(taskString) {
//Create List Item
var listItem = document.createElement("li");
//input (checkbox)
var checkBox = document.createElement("input"); // checkbox
//label
var label = document.createElement("label");
//input (text)
var editInput = document.createElement("input"); // text
//button.edit
var editButton = document.createElement("button");
//button.delete
var deleteButton = document.createElement("button");

  
  //Each element needs modifying
  
  checkBox.type = "checkbox";
  editInput.type = "text";
  
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  
  label.innerText = taskString;
  
  //Each element needs appending
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

var createUserAcc = function() {
  console.log("creating user acc");
  fb.createUser({
    email    : document.getElementById("input-email").value,
    password : document.getElementById("input-password").value
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
      $('.error-create-account').show();

    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $('.successful-account-message').show();
    }
  });
}

var signIn = function() {
  console.log("signing in...");
  fb.authWithPassword({
    email    : document.getElementById("input-email").value,
    password : document.getElementById("input-password").value
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    $('.error-message').show();  
  } else {
    console.log("Authenticated successfully with payload:", authData);
    $('.login-screen').hide();
    $('.container').show();
    $('.error-message').hide();

  }
});

}


//Add a new task
var addTask = function() {
  console.log("Add task...");
  //Create a new list item with the text from #new-task:
  var listItem = createNewTaskElement(taskInput.value);

  //Append listItem to incompleteTasksHolder
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  //push task to firebase
  //taskInput.value = "";
  // debugger
  // var callback = function(something) {
  //   debugger
  // }
  // var asdf = 
  fb.push({item: taskInput.value});
  

  listItem = '';
}

//Edit an existing task
var editTask = function() {
  console.log("Edit task...");

  var listItem = this.parentNode;
  
  var editInput = listItem.querySelector("input[type=text");
  var label = listItem.querySelector("label");
  
  var containsClass = listItem.classList.contains("editMode");

  
  //if the class of the parent is .editMode
  if(containsClass) {
    //Switch from .editMode
    //label text become the input's value
    label.innerText = editInput.value;
  } else {
    //Switch to .editMode
    //input value becomes the label's text
    var originalLabel = label.innerText;
    

    //copypastethingylol
  fb.once('value', function(snapshot) {
    //gets children, which is all of the data in the firebase
    //Object {key: fjdlkjga, key: fjalkega, etc}
    var children = snapshot.val();
    console.log(children);


    //loop to go through all the children/all the keys
    for (var child_id in children) {

      //returns a string form of the key
      var child = fb.child(child_id);
      console.log(child);

      //returns a firebase url to key: test-1-sely.firebaseio.com/KEY_VALUE
      var childPath = child.toString();

      //creates a new firebase database thing at the url above
      var childPathString = new Firebase(childPath);

      //gets the key object (not the string version)
      var childRef = children[child_id];
      console.log(childRef);

      //gets the value of the item in the key {key -> item: "value"}
      var item = childRef["item"];
      console.log(item);
      if (listItem.getElementsByTagName("label")[0].innerHTML == originalLabel) {
        editInput.value = label.innerText;
    var input = editInput.value;
    console.log(input);
      item = input;
      console.log(item);
      }
    }
  });

  }
  
  //Toggle .editMode on the list item
  listItem.classList.toggle("editMode");

  console.log(editInput.value);
  //listItem.getElementsByTagName("label")[0].innerHTML
}

//Delete an existing task
var deleteTask = function() {
  console.log("Delete task...");
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
 
 
  //delete from firebase
  fb.once('value', function(snapshot) {
    //gets children, which is all of the data in the firebase
    //Object {key: fjdlkjga, key: fjalkega, etc}
    var children = snapshot.val();
    console.log(children);


    //loop to go through all the children/all the keys
    for (var child_id in children) {

      //returns a string form of the key
      var child = fb.child(child_id);
      console.log(child);

      //returns a firebase url to key: test-1-sely.firebaseio.com/KEY_VALUE
      var childPath = child.toString();

      //creates a new firebase database thing at the url above
      var childPathString = new Firebase(childPath);

      //gets the key object (not the string version)
      var childRef = children[child_id];
      console.log(childRef);

      //gets the value of the item in the key {key -> item: "value"}
      var item = childRef["item"];
      console.log(item);

      //compare it with the label of the actual task
      if (listItem.getElementsByTagName("label")[0].innerHTML == item) {
        //removes the thing from firebase
        childPathString.remove();
        //removes task from the html
        ul.removeChild(listItem);
        break;
      }

  }
  });


}


//Mark a task as complete
var taskCompleted = function() {
  console.log("Task complete...");
  //Append the task list item to the #completed-tasks
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

//Mark a task as incomplete
var taskIncomplete = function() {
  console.log("Task incomplete...");
  //Append the task list item to the #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  console.log("Bind list item events");
  //select taskListItem's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  
  //bind editTask to edit button
  editButton.onclick = editTask;
  
  //bind deleteTask to delete button
  deleteButton.onclick = deleteTask;
  
  //bind checkBoxEventHandler to checkbox
  checkBox.onchange = checkBoxEventHandler;

  //bind login button to signIn
  loginButton.onclick = signIn;

  //bind create account button to createUserAcc
  createAccountButton.onclick = createUserAcc
}

var ajaxRequest = function() {
  console.log("AJAX request");
}

//Set the click handler to the addTask function
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);

//cycle over incompleteTasksHolder ul list items
for(var i = 0; i < incompleteTasksHolder.children.length; i++) {
  //bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for(var i = 0; i < completedTasksHolder.children.length; i++) {
  //bind events to list item's children (taskIncomplete)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

































