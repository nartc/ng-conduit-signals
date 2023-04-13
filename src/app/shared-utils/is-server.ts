import { isPlatformServer } from "@angular/common";
import { PLATFORM_ID, inject } from "@angular/core";

export const injectIsServer = () => isPlatformServer(inject(PLATFORM_ID));