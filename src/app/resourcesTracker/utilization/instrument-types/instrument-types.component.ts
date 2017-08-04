import { Component, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { InstrumentTypesService } from './instrument-types.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { Color } from 'ng2-charts';


@Component({
    selector: 'instrument-types',
    templateUrl: 'instrument-types.component.html',
    styleUrls: ['instrument-types.component.css']
})

export class InstrumentTypesComponent implements OnInit {
    @Language() lang: string;
    public busy: Subscription;
    public instrumentTypes: any[] = [];
    public instrumentsByInstrumentTypeId: any[] = [];
    public errorResourceCategory: any;
    public flagInstrumentTypes: any;
    public flagInstrumentsByInstrumentTypeId: any;
    public errorInstruments: any;
    public mfs_id: any;
    public mfs_name: any;
    public selectedTab = 0;
    public decimalPrecision: any = environment.precision;

    public amberValue: any;
    public yellowValue: any;
    public greenValue: any;
    public donutResult: any;
    public labels: string[];
    data: any[] = ['35', '45', '20'];
    type: string = 'doughnut';

    colorsEmpty: Array<Color> = [];
    colorsOverride: Array<Color> = [{

    }];
    colorsEmptyObject: Array<Color> = ['#f4ed11', '#fab600', '#7ed321'];

    public donutDatasets: any[];

    constructor(public instrumentTypesService: InstrumentTypesService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.mfs_id = params.mfsId;
            this.mfs_name = params.mfsName;
        });
        this.instrumentTypesByMfsId(this.mfs_id);
        this.getDonutChart();
    }
    instrumentTypesByMfsId(mfs_id: any) {
        this.busy = this.instrumentTypesService.getInstrumentTypesMfsId(mfs_id)
            .subscribe((result: any) => {
                if (result.length === 0) {
                    this.errorInstruments = 'instrumentTypesComponent.errorResourceCategory';
                } else {
                    for (let i = 0; i < result.length; i++) {
                        this.flagInstrumentTypes = true;
                        this.instrumentTypes.push(result[i]);
                        this.instrumentTypesService.getinstrumentsByInstrumentTypeIdAndMfsId(this.mfs_id, result[i].id)
                            .subscribe((resultType: any) => {
                                this.instrumentsByInstrumentTypeId = [];
                                for (let j = 0; j < resultType.length; j++) {
                                    this.flagInstrumentsByInstrumentTypeId = true;
                                    this.instrumentsByInstrumentTypeId.push(resultType[j]);
                                }
                                this.instrumentTypes[i]['instruments'] = this.instrumentsByInstrumentTypeId;
                                if (this.flagInstrumentsByInstrumentTypeId === false) {
                                    this.errorInstruments = 'instrumentTypesComponent.errorResourceCategory';
                                }
                            }, (err: any) => {
                                if (err === 422) {
                                    this.errorResourceCategory = 'instrumentTypesComponent.errorResourceCategory';
                                }
                            });
                    }
                }
                if (this.flagInstrumentTypes === false) {
                    this.errorInstruments = 'instrumentTypesComponent.errorResourceCategory';
                }
            }, (err: any) => {
                if (err === 422) {
                    this.errorResourceCategory = 'instrumentTypesComponent.errorResourceCategory';
                }
            });
    }
    getmfsPageForResourceUtilization() {
        this.router.navigate(['/home/resourcestracker/utilization']);
    }

    getDonutChart(instrumentsId?: any, instrumentTypeId?: any) {
        if (instrumentsId === undefined || instrumentsId === null) {
            this.donutDatasets = [{
                data: [0, 0, 100],
                backgroundColor: ['#ffb324', '#f4ed11', '#b3ea32']
            }];
            this.labels = ['Off', 'Idle', 'Operating'];
        } else {
            this.instrumentTypesService.getinstrumentsByInstrumentTypeIdAndMfsId(this.mfs_id, instrumentTypeId)
                .subscribe((resultType: any) => {
                    this.instrumentsByInstrumentTypeId = [];
                    for (let j = 0; j < resultType.length; j++) {
                        if (String(instrumentsId) === String(resultType[j].id)) {
                            this.donutDatasets = [{
                                data: [resultType[j].rag_totals.R.toFixed(1), resultType[j].rag_totals.A.toFixed(1),
                                (100 - (resultType[j].rag_totals.R + resultType[j].rag_totals.A)).toFixed(1)],
                                backgroundColor: ['#ffb324', '#f4ed11', '#b3ea32']
                            }];
                            this.labels = ['Off', 'Idle', 'Operating'];
                        }
                    }

                }, (err: any) => {
                    if (err === 422) {
                        this.errorResourceCategory = 'instrumentTypesComponent.errorResourceCategory';
                    }
                });
        }
    }
}
