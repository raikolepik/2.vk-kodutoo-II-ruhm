$(document).ready(function() {
     notes = $("#notes"); // get references to the 'notes' list

     // clicking the 'New Note' button adds a new note to the list
   $("#btnNew").click(function() {
        addNewNote();
    });

 });

//  adds a new note to the 'notes' list
  function addNewNote(class, title, content) {
      // if class is not specified, use a random colour class
      if (!class) {
          class = "colour" + Math.ceil(Math.random() * 3);
      }

      // add a new note to the end of the list
      notes.append("<li><div class='" + class + "'>" +
                   "<textarea class='note-title' placeholder='Untitled' maxlength='10'/>" +
                   "<textarea class='note-content' placeholder='Your content here'/>" +
                   "<img class='hide' src='images/close.png'/>" +
                   "</div></li>");

      // get the new note that's just been added and attach the click event handler to its close button
      var newNote = notes.find("li:last");
      newNote.find("img").click(function() {
          newNote.remove();
      });

      // hook up event handlers to show/hide close button as appropriate
      addNoteEvent(newNote);

      // if a title is provided then set the title of the new note
      if (title) {
          // get the title textarea element and set its value
          newNote.find("textarea.note-title").val(title);
      }

      // if a content is provided then set the content of the new note
      if (content) {
          // get the content textarea element and set its value
          newNote.find("textarea.note-content").val(content);
      }
  }

  function addNoteEvent(noteElement) {
      noteElement.focus(function () {
          $(this).find(".img").removeClass("hide");
      }).hover(function() {
          $(this).find("img").removeClass("hide");
      }, function () {
          $(this).find("img").addClass("hide");
      });
  }
