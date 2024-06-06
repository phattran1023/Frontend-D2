import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
    name: 'validationError',
    standalone: true
})
export class ValidationErrorPipe implements PipeTransform {
  
    transform(errors: ValidationErrors | null | undefined): string {
        return errors ?
            Object.entries(errors)
                .map(([key, value]) => 
                    typeof value === 'string' && value.length > 0 ? value : this._handleErrorMsg(key, value)
                )
                .join('. ') :
            '';
    }
  
    private _handleErrorMsg(key: string, value: any) {
        // Nêú có lỗi khác ngoài những cái ở dưới thì liệt kê ra thêm 
        // console.log(key, value)
        switch(key) {
            case 'required':
              return 'Required'
            case 'minlength':
                return `Minimum ${value?.requiredLength} characters`
            case 'maxlength':
                return `Maximum ${value?.requiredLength} characters`
            case 'min':
                return `Min ${value?.min}` 
            case 'max':
                return `Max ${value?.max}`
            default:
                return 'Unknown Error'
        }
    }
}