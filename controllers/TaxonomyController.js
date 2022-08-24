module .exports = {

    // TÜM TAKSONOMİLERİ GETİR
    GetAll: function(request, response){
        return response.status(200).json({ status: true, message: "// TÜM TAKSONOMİLERİ GETİR" });
    },

    // TEK BİR TAKSONOMİ BİLGİSİ GETİR
    GetOne: function(request, response){
        return response.status(200).json({ status: true, message: "// TEK BİR TAKSONOMİ BİLGİSİ GETİR" });
    },

    // TEK BİR TAKSONOMİYİ TERİMLERİ İLE BİRLİKTE GETİR.
    GetOneWithTerms: function(request, response){
        return response.status(200).json({ status: true, message: "// TEK BİR TAKSONOMİYİ TERİMLERİ İLE BİRLİKTE GETİR." });
    },

    // YENİ BİR TAKSONOMİ OLUŞTUR
    Create: function(request, response){
        return response.status(200).json({ status: true, message: "// YENİ BİR TAKSONOMİ OLUŞTUR" });
    },

    // TAKSONOMİYİ GÜNCELLE
    Update: function(request, response){
        return response.status(200).json({ status: true, message: "// TAKSONOMİYİ GÜNCELLE" });
    },

    // TAKSONOMİYİ SİL TERİMLERİ VE BAĞLANTI TABLOSUNDAKİ TERİMLER İLE BERABER
    Delete: function (request, response){
        return response.status(200).json({ status: true, message: "// TAKSONOMİYİ SİL TERİMLERİ VE BAĞLANTI TABLOSUNDAKİ TERİMLER İLE BERABER" });
    },

    // TÜM TERİMLERİ GETİR
    Terms: function(request, response){
        return response.status(200).json({ status: true, message: "// TÜM TERİMLERİ GETİR" });
    },

    // TAKSONOMİYE BİR TERİM EKLE
    AddTerm: function(request, response){
        return response.status(200).json({ status: true, message: "// TAKSONOMİYE BİR TERİM EKLE" });
    },

    // TERİMİ GÜNCELLE
    UpdateTerm: function(request, response){
        return response.status(200).json({ status: true, message: "// TERİMİ GÜNCELLE" });
    },

    // TERİMİ SİL
    DeleteTerm: function(request, response){
        return response.status(200).json({ status: true, message: "// TERİMİ SİL" });
    },


}