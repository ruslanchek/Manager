app.pdf = {
    getPDF: function(text){
        var doc = new jsPDF();
        doc.text(20, 20, text);
        doc.save('Test.pdf');
    }
};