module.exports = {

    // MENÜLERİ GETİR.
    GetAll: function(request, response){
        return response.status(200).json( {status:true, message: "// MENÜLERİ GETİR."} );
    },

    // PARAMSLAR İLE İD'Sİ GELEN MENÜYÜ GETİR.
    GetOne: function(request, response){
        return response.status(200).json( {status:true, message: "// PARAMSLAR İLE İD'Sİ GELEN MENÜYÜ GETİR."} );
    },

    // PARAMSLAR İLE İD'Sİ GELEN MENÜYÜ ELEMANLARI İLE GETİR.
    GetOneWithItems: function(request, response){
        return response.status(200).json( {status:true, message: "// PARAMSLAR İLE İD'Sİ GELEN MENÜYÜ ELEMANLARI İLE GETİR."} );
    },

    // YENİ BİR MENÜ OLUŞTUR
    Create: function(request, response){
        return response.status(200).json( {status:true, message: "// YENİ BİR MENÜ OLUŞTUR"} );
    },

    // BİR MENÜYÜ DÜZENLE
    Update: function(request, response){
        return response.status(200).json( {status:true, message: "// BİR MENÜYÜ DÜZENLE"} );
    },

    // VAR OLAN BİR MENÜYÜ ELEMANLARI İLE BİRLİKTE SİL.
    Delete: function(request, response){
        return response.status(200).json( {status:true, message: "// VAR OLAN BİR MENÜYÜ ELEMANLARI İLE BİRLİKTE SİL."} );
    },

    // SADECE MENÜYE AİT TÜM ELEMANLARI GÖSTER
    Clean: function(request, response){
        return response.status(200).json( {status:true, message: "// SADECE MENÜYE AİT TÜM ELEMANLARI GÖSTER"} );
    },

    // MENÜYE YENİ BİR ELEMAN EKLE
    AddItem: function(request, response){
        return response.status(200).json( {status:true, message: "// MENÜYE YENİ BİR ELEMAN EKLE"} );
    },

    // MENÜ ELEMANINI GÜNCELLEŞTİR
    UpdateItem: function(request, response){
        return response.status(200).json( {status:true, message: "// MENÜ ELEMANINI GÜNCELLEŞTİR"} );
    },

    // MENÜ ELEMANINI SİL.
    DeleteItem: function(request, response){
        return response.status(200).json( {status:true, message: "// MENÜ ELEMANINI SİL."} );
    }

}