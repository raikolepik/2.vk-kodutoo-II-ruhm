(function(){
   "use strict";

   var Retsept = function(){

     // SEE ON SINGLETON PATTERN
     if(Retsept.instance){
       return Retsept.instance;
     }
     //this viitab Retsept fn
     Retsept.instance = this;

     this.routes = Retsept.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     // hakkan hoidma kõiki purke
     this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Retsept = Retsept; // Paneme muuutja külge

   Retsept.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>loend');



       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Retsept.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.jars){
           //võtan stringi ja teen tagasi objektideks
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.id, jar.title, jar.ingredients);

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });

       }else{

		   //küsin AJAXIGA
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {

					console.log(xhttp.responseText);
					//tekst -> objekktideks
					Retsept.instance.jars = JSON.parse(xhttp.responseText);
					console.log(Retsept.instance.jars);

					//teen purgid htmli
					Retsept.instance.jars.forEach(function(jar){

					   var new_jar = new Jar(jar.id, jar.title, jar.ingredients);

					   var li = new_jar.createHtmlElement();
					   document.querySelector('.list-of-jars').appendChild(li);

				   });

				   //salvestan localStoragisse
				   localStorage.setItem('jars', JSON.stringify(Retsept.instance.jars));


				}
			};
			xhttp.open("GET", "save.php", true);
			xhttp.send();


	   }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
	 deleteJar: function(event){

		// millele vajutasin SPAN
		console.log(event.target);

		// tema parent ehk mille sees ta on LI
		console.log(event.target.parentNode);

		//mille sees see on UL
		console.log(event.target.parentNode.parentNode);

		//id
		console.log(event.target.dataset.id);

		var c = confirm("Oled kindel?");

		// vajutas no, pani ristist kinni
		if(!c){	return; }

		//KUSTUTAN
		console.log('kustutan');

		// KUSTUTAN HTMLI
		var ul = event.target.parentNode.parentNode;
		var li = event.target.parentNode;

		ul.removeChild(li);

		//KUSTUTAN OBJEKTI ja uuenda localStoragit

		var delete_id = event.target.dataset.id;

		for(var i = 0; i < this.jars.length; i++){

			if(this.jars[i].id == delete_id){
				//see on see
				//kustuta kohal i objekt ära
				this.jars.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('jars', JSON.stringify(this.jars));



	 },
   //Commit 2
   editJar: function(event){

    var title = prompt("Sisesta uus värv");
    var ingredients = prompt("Sisesta uus materjal");


    // KUSTUTAN HTMLI
    var ul = event.target.parentNode.parentNode;
    var li = event.target.parentNode;

    ul.removeChild(li);

    //KUSTUTAN OBJEKTI ja uuenda localStoragit

    var delete_id = event.target.dataset.id;

    for(var i = 0; i < this.jars.length; i++){

      if(this.jars[i].id == delete_id){
        //see on see
        //kustuta kohal i objekt ära
        this.jars.splice(i, 1);
        break;
      }
    }


    var id = guid();
    var new_jar = new Jar(id, title, ingredients);

    this.jars.push(new_jar);

    localStorage.setItem('jars', JSON.stringify(this.jars));

    var uusli = new_jar.createHtmlElement();
    document.querySelector('.list-of-jars').appendChild(uusli);



  }, // Commit 2 lõpp
     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisõna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var ingredients = document.querySelector('.ingredients').value;

       //console.log(title + ' ' + ingredients);
       //1) tekitan uue Jar'i
	   var id = guid();
       var new_jar = new Jar(id, title, ingredients);

       //lisan massiiivi purgi
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));


		//AJAX
		var xhttp = new XMLHttpRequest();

		//mis juhtub kui päring lõppeb
		xhttp.onreadystatechange = function() {

			console.log(xhttp.readyState);

			if (xhttp.readyState == 4 && xhttp.status == 200) {

				console.log(xhttp.responseText);
			}
		};

		//teeb päringu
		xhttp.open("GET", "save.php?id="+id+"&title="+title+"&ingredients="+ingredients, true);
		xhttp.send();


       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LÕPP

   var Jar = function(new_id, new_title, new_ingredients){
	 this.id = new_id;
     this.title = new_title;
     this.ingredients = new_ingredients;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.ingredients);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);


       // COMMIT 1
       var span_edit = document.createElement('span');
       span_edit.style.color = "green";
       span_edit.style.cursor = "pointer";
       //kustutamiseks panen id kaasa
       span_edit.setAttribute("data-id", this.id);

       span_edit.innerHTML = " Edit";

       li.appendChild(span_edit);

       // 1 END



	   //DELETE nupp
	   var span_delete = document.createElement('span');
	   span_delete.style.color = "red";
	   span_delete.style.cursor = "pointer";

	   //kustutamiseks panen id kaasa
	   span_delete.setAttribute("data-id", this.id);

	   span_delete.innerHTML = " Delete";

	   li.appendChild(span_delete);

	   //keegi vajutas nuppu
     span_delete.addEventListener("click", Retsept.instance.deleteJar.bind(Retsept.instance));
	   span_edit.addEventListener("click", Retsept.instance.editJar.bind(Retsept.instance));

       return li;

     }
   };

   //HELPER
   function guid(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Retsept();
   };

})();
