$(document).ready(function(){	
	var btnInsertar=$("#btnInsertar");
	var btnEliminar=$("#btnEliminar");
	var btnModificar=$("#btnModificar");
	var btnGuardar=$("#btnGuardar");
	var btnCancelar=$("#btnCancelar");
	var txtSiglas=$("#txtSiglas");
	var txtSignificado=$("#txtSignificado");
	var txtDescripcion=$("#txtDescripcion");
	var mdlSigla=$("#mdlSigla").modal({dismissible: false,});
	var dtSiglas=$("#dtSiglas").DataTable({
				"paging":   false,
		        "ordering": false,
		        "info":     false
		        
			});
	var lstAcciones={
		Nuevo:"Guardar"
		,Modificar:"Modificar"
		,Eliminar:"Eliminar"
	}
	var accion;
	var starCountRef=firebase.database().ref("siglas");
	starCountRef.on("value",
		function(snapshot) {		
			dtSiglas.clear().draw();	
			if(snapshot.val()!=null){
				$.each(snapshot.val(),function(index,value){									
					var row=dtSiglas.row.add( [index,value.name,value.description] )
	    					.draw()
		    				.node();
				});
			}
		}
	);

	var Limpiar=function(){
		txtSiglas.val("");
		txtSignificado.val("");
		txtDescripcion.val("");
	};

	var Validar=function(){
		if(txtSiglas.val()==""){
			Materialize.toast('Ingrese una sigla', 4000);
			return false;
		}else if(txtSignificado.val()==""){
			Materialize.toast('Ingrese el significado de la sigla', 4000);
			return false;
		}
		else if(txtDescripcion.val()==""){
			Materialize.toast('Ingrese una descripcion para la sigla', 4000);
			return false;
		}else{
			return true;
		}
	}

	btnInsertar.on("click",function(e){
		accion=lstAcciones.Nuevo;
		Limpiar();
		txtSiglas.prop('disabled', false);
		mdlSigla.modal('open');
	});
	btnModificar.on("click",function(e){
		accion=lstAcciones.Modificar;
		var row=dtSiglas.row(".selected");
		if(row.length>0){
			var data=row.data();
			txtSiglas.prop('disabled', true);
			txtSiglas.val(data[0]);
			txtSignificado.val(data[1]);
			txtDescripcion.val(data[2]);
			mdlSigla.modal('open');
		}else{
			Materialize.toast('Seleccione un registro de la tabla', 4000);
		}
	});
	btnEliminar.on("click",function(e){
		var row=dtSiglas.row(".selected");
		if(row.length>0){
			var data=row.data();
			var Sigla=data[0];
			swal({
			  title: "Eliminar?",
			  text: "Realmente desea eliminar la sigla seleccionada",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Si",
			  closeOnConfirm: false
			},
			function(){
				var starCountRef=firebase.database().ref("siglas/"+Sigla);
				starCountRef.remove(function(error) {
					if(error==null){
						swal("Eliminado!", "Sigla Eliminada correctamente", "success");
					}else{
						swal("Error!", "No se pudo eliminar el registro", "warning");
					}
				 });
				
			});
		}else{
			Materialize.toast('Seleccione un registro de la tabla', 4000);
		}
	});

	btnCancelar.on("click",function(e){
		mdlSigla.modal("close");
	});

	btnGuardar.on("click",function(e){
		if(Validar()){
			var Sigla=txtSiglas.val().toUpperCase().trim();
			if(accion==lstAcciones.Nuevo){				
				var starCountRef=firebase.database().ref("siglas/"+Sigla);
				starCountRef.once('value').then(
					function(snapshot) {									
						if(snapshot.val()==null){
							firebase.database().ref('siglas/' + Sigla).set({
								description: txtDescripcion.val(),
								name: txtSignificado.val()
							});
							mdlSigla.modal("close");
							Materialize.toast('Sigla Ingresada correctamente', 4000);
							
						}else{
							Materialize.toast('La sigla ya existe', 4000);
							
						}
					}
				);

			}else if(accion==lstAcciones.Modificar){
				firebase.database().ref('siglas/' + Sigla).set({
					description: txtDescripcion.val(),
					name: txtSignificado.val()
				});
				mdlSigla.modal("close");
				Materialize.toast('Sigla Modificada correctamente', 4000);
			}
		}

	});

	 $(document).on( 'click', '.selectedTable tbody tr', function () {
    	var table=$($(this).parent("tbody").parent("table"));
    	
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {			        				  
            table.children('tbody').children("tr.selected").removeClass('selected');
            $(this).addClass('selected');
        }
    } );
	
});
