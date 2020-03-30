module.exports = {
    age: function(birthTimestamp){
        const today = new Date();
        const birthDate = new Date(birthTimestamp);
        let age = today.getFullYear() - birthDate.getFullYear();

        const month = today.getMonth() - birthDate.getMonth();

        if(month <= 0 && today.getDate() < birthDate.getDate()){
            age = age - 1;
        }

        return age;
    },
    date: function(birthTimestamp){
        const date = new Date(birthTimestamp);

        const year = date.getUTCFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);
        const hour = date.getHours();
        const minutes = `0${date.getMinutes()}`.slice(-2);
        return {
            hourFormat: `${hour}:${minutes}`,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        };
    },
    formatPrice: function(value){

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100);
    },
    formatCpfCnpj(value){
        value = value.replace(/\D/g, "");

        if(value.length > 14){
            value = value.slice(0, -1);
        }

        if(value.length > 11){

            //11222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2");

            //11.222333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2");

            //11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2");

            //11.222.333/444455
            value = value.replace(/(\d{4})(\d)/, "$1-$2");

            //11.222.333.4444-55
        }else{

            //11122233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2");

            //111.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2");

            //111.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1-$2");

            //111.222.333-44
        }

        return value;
    },
    formatCep(value){
        value = value.replace(/\D/g, "");

        if(value.length > 8){
            value = value.slice(0, -1);
        }

        value = value.replace(/(\d{5})(\d)/, "$1-$2");

        return value;
    }
}