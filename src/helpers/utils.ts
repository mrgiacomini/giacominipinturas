import { format } from 'date-fns'

var days = ['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado','Domingo'];

export function formatDate(date: any) {
    if (!!date) {
        var dateAux = date;

        if (dateAux.indexOf('T') > 0)
            dateAux = dateAux.split('T')[0];

        if (dateAux.indexOf('-') > 0) {
            dateAux = dateAux.split('-');
            return format(new Date(dateAux[0], dateAux[1]-1, dateAux[2]), 'dd/MM/yyyy'); 
        }
        else if (dateAux.indexOf('/') > 0) {
            dateAux = dateAux.split('/');
            return format(new Date(dateAux[2], dateAux[1]-1, dateAux[0]), 'yyyy-MM-dd'); 
        }
        else 
            return date;
    } 
    else    
        return '';
};

export const formatNumber = (amount, decimalCount = 2, decimal = ",", thousands = ".") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

export const dayOfWeek = (day) => {
    return days[day];
};

export function countLines(value:string) {
  var count = 1;
  if (!!value)
      count = value.split("\n").length;
  return count > 1 ? count : 2;
};  

export function setToday(input: string, setFieldValue:any) {
  setFieldValue(input, formatDate(new Date().toISOString()));
};