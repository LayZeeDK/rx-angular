import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LetModule, PushModule, UnpatchEventsModule } from '@rx-angular/template';
import { PipeModule } from '../../../../rx-angular-pocs/template/pipes/pipe/pipe.module';
import { DirtyChecksModule } from '../../../../shared/debug-helper/dirty-checks';
import { PipePocComponent } from './pipe-poc.component';
import { ROUTES } from './pipe-poc.routes';

const DECLARATIONS = [PipePocComponent];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    PipeModule,
    DirtyChecksModule,
    MatButtonModule,
    UnpatchEventsModule,
    PushModule,
    LetModule
  ],
  exports: [DECLARATIONS]
})
export class PipePocModule {
}
