import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

// Serialize에 넣어 줄 수 있는 대상을 클래스로 제한한다.
// 하나 이상의 클래스를 설정할 수 있다.
interface ClassConstructor {
  new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

// 이 클래스는 패스워드를 제거한 객체를 반환하기 위한 용도이다.
export default class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    // request가 들어 올 때 실행되는 부분 
    return next.handle().pipe(
      // Run something before the response is sent out
      map((data: any) => {
        console.log('Serialize interceptor performed')
        return plainToInstance(this.dto, data, {
          // @Expose decorator가 동작하도록 설정
          excludeExtraneousValues: true
        });
      }),
    );
  }
}