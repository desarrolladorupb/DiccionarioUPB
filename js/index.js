$(document).ready(function(){
	var txtBuscar=$("#txtBuscar");
	var starCountRef=firebase.database().ref("siglas");
	var txtName=$("#txtName");
	var txtMeaning=$("#txtMeaning");
	var txtDescription=$("#txtDescription");
	starCountRef.on("value",
		function(snapshot) {			
			if(snapshot.val()!=null){
				var source=[];
				$.each(snapshot.val(),function(index,value){					
					source.push({name:index,id:index,description:value.description,meaning:value.name});					
				});
				txtBuscar.typeahead({
				  source: source,
				  autoSelect: true
				});
				
			}
		}
	);


	
	txtBuscar.change(function() {

	  var current = txtBuscar.typeahead("getActive");
	  
	  if (current) {
	    // Some item from your model is active!
	    if (current.name == txtBuscar.val()) {	     	
	     	txtName.html(current.id);
			txtMeaning.html(current.meaning);
			txtDescription.html(current.description);
	    } else {
	      // This means it is only a partial match, you can either add a new item
	      // or take the active if you don't want new items
	    }
	  } else {
	    // Nothing is active so it is a new value (or maybe empty value)
	  }
	});
});
