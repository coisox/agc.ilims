var prefix = 'ILIMS_';
var currentVersion = 'v180219';
var rozaCallLandingFile, rozaSetTaskbar, rozaSetPanel, rozaViewMode, rozaBindData, rozaBindLov, rozaGetParam, rozaModal, rozaClearData, rozaResetData, rozaHasRole, rozaVersion, rozaUserId, rozaUserName, rozaUserRole, rozaEqualPanel;

if(!localStorage.getItem(prefix+'rozaUserPic')) localStorage.setItem(prefix+'rozaUserPic', 'images/alien.png');
if(!localStorage.getItem(prefix+'rozaUserId')) localStorage.setItem(prefix+'rozaUserId', '-1');
if(!localStorage.getItem(prefix+'rozaUserName')) localStorage.setItem(prefix+'rozaUserName', 'Roza');
if(!localStorage.getItem(prefix+'rozaUserRole')) localStorage.setItem(prefix+'rozaUserRole', '');
if(!localStorage.getItem(prefix+'rozaLanguage')) localStorage.setItem(prefix+'rozaLanguage', 'bm');
if(!localStorage.getItem(prefix+'Favourites')) localStorage.setItem(prefix+'Favourites', '[{"label":"Test Global Search 123","keyword":"Test Global Search 123"},{"label":"Test Global Search 456","keyword":"Test Global Search 456"}]');
if(!localStorage.getItem(prefix+'conf')) {
	localStorage.setItem(prefix+'conf', `{
		"theme":"theme-night-sky",
		"panelsize":"400"
	}`);
}

var rozaLanguage = localStorage.getItem(prefix+'rozaLanguage');

$(document).ready(function(){
	initVue();
});

var morris = [];
function initMorris() {
	var backgroundColor = ['#F44236','#FFE93B','#8BC24A'];
	
	for(var i=1; i<4; i++) {
		var data;
		
		if(i==1) data = [
			{ label:'Tamat Tempoh', value:10 },
			{ label:'Semasa', value:20 },
			{ label:'Selesai', value:50 }
		];
		
		else if(i==2) data = [
			{ label:'Tamat Tempoh', value:5 },
			{ label:'Semasa', value:50 },
			{ label:'Selesai', value:5 }
		];
		
		else if(i==3) data = [
			{ label:'Tamat Tempoh', value:0 },
			{ label:'Semasa', value:10 },
			{ label:'Selesai', value:100 }
		];
		
		if($('#doughnut'+i).find('svg').length==0) {
			morris['doughnut'+i] = Morris.Donut({
				element: 'doughnut'+i,
				data: data,
				colors: backgroundColor,
				resize: true
			});
		}
		else {
			morris['doughnut'+i].setData(data);
		}
	}
}

function initDashboard_ChartJS() {
	Chart.defaults.global.defaultFontSize = 14;
	var options =  { legend: { position: 'right' } };
	var labels = ['Tamat Tempoh','Semasa','Selesai'];
	var backgroundColor = ['#F44236','#FFE93B','#8BC24A'];
	
	var doughnut1 = new Chart($('#doughnut1'), {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{data: [5,10,30], backgroundColor: backgroundColor}]
		},
		options: options
	});
	
	var doughnut2 = new Chart($('#doughnut2'), {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{data: [2,20,30], backgroundColor: backgroundColor}]
		},
		options: options
	});
	
	var doughnut3 = new Chart($('#doughnut3'), {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{data: [0,10,10], backgroundColor: backgroundColor}]
		},
		options: options
	});
}

function initVue() {
	Vue.component('com-standardlist-tools', {
		template:
			'<ul class="nav navbar-right panel_toolbox">'+
				'<li class="dropdown">'+
					'<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-sort-amount-desc"></i></a>'+
					'<ul class="dropdown-menu" role="menu">'+
						'<li v-if="standardlistv2[listid].list.length>0 && standardlistv2[listid].list[0].ROZA_TIME"><label @click="sortListV2(listid, \'ROZA_EPOCH\')">{{language==\'bm\'?\'Masa\':\'Time\'}} &nbsp; <i class="fa" :class="{\'fa-sort-amount-asc\':standardlistv2[listid].sortBy==\'ROZA_EPOCH_DESC\', \'fa-sort-amount-desc\':standardlistv2[listid].sortBy==\'ROZA_EPOCH_ASC\'}"></i></label></li>'+
						'<li v-if="standardlistv2[listid].list.length>0 && standardlistv2[listid].list[0].ROZA_STATUS"><label @click="sortListV2(listid, \'ROZA_STATUS\')">Status &nbsp; <i class="fa" :class="{\'fa-sort-amount-asc\':standardlistv2[listid].sortBy==\'ROZA_STATUS_DESC\', \'fa-sort-amount-desc\':standardlistv2[listid].sortBy==\'ROZA_STATUS_ASC\'}"></i></label></li>'+
						'<li><label @click="sortListV2(listid, \'ROZA_TITLE\')">{{language==\'bm\'?\'Tajuk\':\'Title\'}} &nbsp; <i class="fa" :class="{\'fa-sort-amount-asc\':standardlistv2[listid].sortBy==\'ROZA_TITLE_DESC\', \'fa-sort-amount-desc\':standardlistv2[listid].sortBy==\'ROZA_TITLE_ASC\'}"></i></label></li>'+
					'</ul>'+
				'</li>'+
				'<li class="dropdown">'+
					'<a class="dropdown-toggle" :class="{standardlist_hasFilter:standardlistv2[listid].filterString!=\'\'}" data-toggle="modal" data-target="#modalFilter"><i class="fa fa-filter"></i></a>'+
				'</li>'+
			'</ul>',
		props: ['listid', 'standardlistv2', 'language']
	});

	roza = new Vue({
		el: '#roza',
		data: {
			conf: JSON.parse(localStorage.getItem(prefix+'conf')),
			globalSearchKeyword: '',
			rozaVersion: localStorage.getItem(prefix+'rozaVersion'),
			rozaUserPic: localStorage.getItem(prefix+'rozaUserPic'),
			rozaUserId: localStorage.getItem(prefix+'rozaUserId'),
			rozaUserName: localStorage.getItem(prefix+'rozaUserName'),
			rozaUserRole: localStorage.getItem(prefix+'rozaUserRole').split(','),
			rozaLanguage: localStorage.getItem(prefix+'rozaLanguage'),
			breadcrumb: '',
			breadcrumbBuffer: '',
			sessionParam: {},
			menu: {
				level: 1,
				parentIndex: 0,
				list: []
			},
			activeMetro: '',
			standardlist: {
				activeItem: '',
				sortBy: ''
			},
			standardlistv2: {
				listTask: {
					activeItem: '',
					sortBy: '',
					filterString: '',
					filterString: '',
					list: []
				}
			},
			taskbar: {},
			accordions: {},
			accordionsPrev: '',
			tabLevel1: {},
			tabLevel2: {},
			vueTable: [],
			panel: {
				leftPanel: {
					//initQueryBuilder: false,
					filterString: '',
					type: '',
					prop: [],
					show: true
				},
				rightPanel: {
					filterString: '',
					type: '',
					prop: [],
					show: true
				},
				fullPanel: {
					filterString: '',
					type: '',
					prop: [],
					show: false
				},
				dashboardTask: {
					filterString: '',
					type: '',
					prop: [],
					show: false
				}
			},
			modalProp: [],
			dropzoneAction: 'main.html',
			favourites: JSON.parse(localStorage.getItem(prefix+'Favourites')),
			callbackQue: [],
			viewMode: true,
			page: 'module'
		},
		methods: {
			metroClick: function(item, level, index) {
				if(level=='m1') {
					if(item.list) this.menu.level = 2;
					this.menu.parentIndex = index;
					this.activeMetro = index;
					this.setBreadcrumbBuffer(1, item['label'+this.rozaLanguage]);
				}
				else {
					this.activeMetro = this.menu.parentIndex+'>'+index;
					this.setBreadcrumbBuffer(2, item['label'+this.rozaLanguage]);
				}

				if(item.onclick) eval(item.onclick);
				else if(!item.list) {
					this.rozaSetPanel();
					this.rozaSetTaskbar();
					this.setBreadcrumbBuffer(3, '<b style="color:#E74C3C">'+(this.rozaLanguage=='bi'?'Module not ready!':'Modul belum disediakan')+'</b>');
					this.breadcrumb = this.breadcrumbBuffer;
				}
			},
			onclick: function(item, event) {
				if(event) event.stopPropagation();
				eval(item.onclick);
			},
			onchange: function(item) {
				eval(item.onchange);
			},
			toast: function(html) {
				$.notify({message:html},{type:'danger', delay:4000});
			},
			sortList: function(panel, sort) {
				if(this.standardlist.sortBy == sort+'_ASC') this.standardlist.sortBy = sort+'_DESC';
				else this.standardlist.sortBy = sort+'_ASC';
				
				this.panel[panel].prop[0].list.sort(function(a, b){
					
					//EPOCH. only numbers can use minus operation
					if(roza.standardlist.sortBy == 'ROZA_EPOCH_ASC') return a[sort] - b[sort];
					else if(roza.standardlist.sortBy == 'ROZA_EPOCH_DESC') return b[sort] - a[sort];
					
					//TITLE. text can only use bigger smaller operation
					else if(roza.standardlist.sortBy == 'ROZA_TITLE_ASC') {
						if(a[sort]==b[sort]) return 0;
						else if(a[sort]<b[sort]) return -1;
						else if(a[sort]>b[sort]) return 1;
					}
					else {
						if(a[sort]==b[sort]) return 0;
						else if(a[sort]<b[sort]) return 1;
						else if(a[sort]>b[sort]) return -1;
					}
				});
			},
			filteredList: function(panel) {
				return this.panel[panel].prop[0].list.filter(function(item) {
					if(item.ROZA_TITLE) return (item.ROZA_TITLE + item.ROZA_TIME + item.ROZA_DESC).toLowerCase().indexOf(roza.panel[panel].filterString.toLowerCase()) > -1
					else return false;
				})
			},
			accessControl: function(item, ac) {
				try {
					return eval(item[ac]);
				}
				catch(err) {
					$.getJSON('roza/ROZA_LogError.php?msg=Condition in '+ac+' problem: '+err.message, function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
			},
			console: function(text) {
				console.log(text);
			},
			/*
			resetQueryBuilder: function(p) {
				$('#'+p+'QueryBuilder').queryBuilder('reset');
				this.panel[p].filterString = '';
			},
			submitQueryBuilder: function(p) {
				console.log("submitQueryBuilder");
				console.log($('#'+p+'QueryBuilder').queryBuilder('getRules'));
			},
			*/
			addFilterRow: function(p, e) {
				if(e==undefined) {
					$('#'+p+' .filterRow:last').after($('#'+p+' .filterRow:last').clone());
					$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
					$('#'+p+' .filterRow:last').removeClass('bad');
				}
				else if($('#'+p+' .filterRow').size()==1){
					$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
					$('#'+p+' .filterRow:last').removeClass('bad');
				}
				else {
					$(e).parents('.filterRow').remove();
				}
			},
			clearFilterRow: function(p) {
				$('#'+p+' .filterRow').not(':last').remove();
				$('#'+p+' .filterRow:last .adv1, #'+p+' .filterRow:last .adv2, #'+p+' .filterRow:last .adv3').val('');
				this.panel[p].filterString = '';
			},
			submitFilterRow: function(p) {
				$('#'+p+' .filterRow').each(function(){
					if($(this).find('.adv1').val()=='' || $(this).find('.adv2').val()=='' || $(this).find('.adv3').val()=='') {
						$(this).addClass('bad');
					}
					else {
						$(this).removeClass('bad');
					}
				});
				if($('#'+p+' .filterRow.bad').size()==0) {
					console.log(JSON.stringify($('#'+p+' .filterRow select, #'+p+' .filterRow input').serialize()));
				}
				/*
				this.rozaSetPanel({
					panel: p,
					ui: 'SampleStaff_Standardlist.json'
				});
				*/
			},
			rozaHasRole: function(array) {
				var match = 0;
				for(var x=0; x<this.rozaUserRole.length; x++) {
					if(array.indexOf(this.rozaUserRole[x])>-1) match++;
				}
				return match;
			},
			rozaModal: function(opt) {
				$('#modalGeneral').modal('hide');
				
				if(opt && opt.ui) {
					roza.modalProp = [];
					
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
								
								if(data.prop[x].element=='table') {
									roza['vueTable'][data.prop[x].id] = [];
									roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
									roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
									roza['vueTable'][data.prop[x].id]['option'] = {
										columnsClasses: {
											Action: 'action_column',
											CheckAll: 'checkall_column'
										},
										headings: {
											CheckAll: function (h) {
												return h('input', {
													attrs: {
														type: 'checkbox',
														id: 'selectAllCheckbox'
													},
													on: {
														click: (e) => {
															this.selectAll(e.srcElement.checked)
														}
													},
													ref: 'selectAllCheckbox'
												})
											},
											Action: roza.rozaLanguage=='bm'?'Tindakan':'Action'
										}
									};
								}
								
								roza.modalProp = data.prop;
								
								$('#modalProp .modal-title').html('').html(opt['title'+this.rozaLanguage]);
								$('#modalProp .modal-header').toggle(opt['title'+this.rozaLanguage]?true:false);
								$('#modalProp #btnCancel').toggle(opt.cancel?true:false);
								$('#modalProp #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
								$('#modalProp').modal({
									show: true,
									backdrop: 'static'
								});
							}
						}
						else roza.toast(data.status);
					});
				}
				else if(opt) {
					$('#modalGeneral .modal-title').html('').html(opt['title'+this.rozaLanguage]);
					$('#modalGeneral .modal-header').toggle(opt['title'+this.rozaLanguage]?true:false);
					$('#modalGeneral #btnCancel').toggle(opt.cancel?true:false);
					$('#modalGeneral .modal-body').html('').html(opt['content'+this.rozaLanguage]);
					$('#modalGeneral #btnOk').attr('onclick', opt.onclick?opt.onclick:'rozaModal()');
					$('#modalGeneral').modal('show');
				}
				else {
					$('#modalGeneral, #modalProp').modal('hide');
				}
			},
			rozaClearData: function() {
				$('.x_content [data-default]').not('.ac_disable, .ac_hide').each(function(){
					$(this).val('');
				});
				$('div[contentEditable]').each(function(){
					$(this).html('');
				});
			},
			rozaResetData: function() {
				$('.x_content [data-default]').each(function(){
					$(this).val($(this).attr('data-default'));
				});
				$('div[contentEditable]').each(function(){
					$(this).html($(this).attr('data-default'));
				});
			},
			/*
			rozaSubmitData: function(opt) {
				if(!opt.file) {
					$.getJSON('roza/ROZA_LogError.php?msg=Property "file" not defined for rozaSubmitData()', function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
				else {
					$.ajax({
						url: 'dev/php/'+opt.file+'?'+$('.x_content .formMain').serialize()+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)),
						dataType: 'json',
						success: function(data) {
							if(data.status=='ok') {
								roza.rozaModal({
									contentbm: 'Data telah dihantar',
									contentbi: 'Data has been sent'
								});
							}
							else roza.toast(data.status);
						},
						error: function(data) {
							if(data.status==404) {
								$.getJSON('roza/ROZA_LogError.php?msg=PHP file not found: '+opt.target, function(data) {
									roza.toast('System error occured and has been reported ('+data.log_id+')');
								});
							}
						}
					});
				}
			},
			*/
			rozaGetParam: function(param) {
				if(param=='rozaUserId') return this.rozaUserId;
				else if(param=='rozaUserName') return this.rozaUserName;
				else if(param=='rozaUserRole') return this.rozaUserRole;
				else if(param=='rozaLanguage') return this.rozaLanguage;
				else if(param=='rozaTimestamp') return Math.floor(new Date()/1000);
				return this.sessionParam[param];
			},
			rozaCallLandingFile: function(file) {
				//save param for next page
				//================================================================================================
				var param = file.split(/[\?&]+/);
				this.sessionParam = {};
				for(var i=1; i<param.length; i++) this.sessionParam[param[i].split('=')[0]] = param[i].split('=')[1];
				//================================================================================================
				
				$.getScript('dev/landing/'+file, function(data, textStatus, jqxhr) {}).fail(function(){
					if(arguments[1]=='error') {
						$.getJSON('roza/ROZA_LogError.php?msg=Landing file not found: '+file, function(data) {
							roza.toast('System error occured and has been reported ('+data.log_id+')');
						});
					}
					else {
						roza.toast(file+': '+arguments[2].toString().replace('ReferenceError: ', ''));
						$.ajax({
							crossDomain: true,
							dataType: "script",
							url: 'dev/landing/'+file
						});
					}
				});
			},
			rozaSetPanel: function(opt) {
				this.page = 'module';
				$('#leftPanel').removeClass('equalPanel');
				this.rozaModal();
				
				if(opt) {
					
					//reset all panel
					this.panel.leftPanel.show = !(opt.panel=='fullPanel');
					this.panel.rightPanel.show = !(opt.panel=='fullPanel');
					this.panel.fullPanel.show = (opt.panel=='fullPanel');
					
					//reset targeted panel querybuilder
					if($('#'+opt.panel+'QueryBuilder.query-builder').size()) $('#'+opt.panel+'QueryBuilder').queryBuilder('reset');

					//reset targeted panel prop
					if(opt.panel!='rightPanel') {
						roza.panel.rightPanel.prop = {};
						roza.panel.rightPanel.type = '';
						//roza.taskbar = {}; Hari tu Masri mcm perlukan nie
					}
					
					//reset targeted panel datatables
					$('#'+opt.panel+' .dataTable [type=checkbox]').iCheck('uncheck');
					roza.updateBulkCount($('#'+opt.panel+' .dataTable .checkall'));

					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							roza.viewMode = true;
							
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
								
								if(data.prop[x].element=='table') {
									roza['vueTable'][data.prop[x].id] = [];
									roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
									roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
									roza['vueTable'][data.prop[x].id]['option'] = {
										columnsClasses: {
											Action: 'action_column',
											CheckAll: 'checkall_column'
										},
										headings: {
											CheckAll: function (h) {
												return h('div', {attrs: {class: 'checkbox'}}, [
														h('input', {attrs: {class: 'flat checkall', type: 'checkbox'}})
													]
												)
											},
											Action: roza.rozaLanguage=='bm'?'Tindakan':'Action'
										}
									};
									
									if(data.prop[x].action_add) {
										roza['vueTable'][data.prop[x].id]['action_add'] = [];
										roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
										roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
										roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
									}
								}
								
								//set default tab
								else if(data.prop[x].element=='tabs') {
									roza.rozaDefaultTab(data.prop[x].list, 1);
								}
								
								//set default accordion
								else if(data.prop[x].element=='accordion') {
									roza.rozaDefaultAccordion(data.prop[x].list);
								}
								
							}
							
							roza.panel[opt.panel].prop = data.prop;
							roza.panel[opt.panel].type = data.prop[0].element=='standardlist'?'standardlist':'ui';

							if(data.prop[0].element=='standardlist') {
								roza.setBreadcrumbBuffer(3, data.prop[0]['label'+roza.rozaLanguage]);
								//roza.panel.leftPanel.initQueryBuilder = true;
							}
							else if(opt.panel!='rightPanel'){
								for(var x=0; x<data.prop.length; x++) {
									if(data.prop[x].element=='title') roza.setBreadcrumbBuffer(3, data.prop[x]['label'+roza.rozaLanguage]);
								}
							}
							roza.breadcrumb = roza.breadcrumbBuffer;
						}
						else roza.toast(data.status);
					});
				}
				else {
					this.panel.leftPanel.show = false;
					this.panel.rightPanel.show = false;
					this.panel.fullPanel.show = false;
				}
			},
			rozaSetTaskbar: function(opt) {
				if(opt) {
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+opt.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
							}
							roza.taskbar = data.prop;
						}
						else roza.toast(data.status);
					});
				}
				else {
					roza.taskbar = {};
				}
			},
			rozaViewMode: function(b) {
				roza.viewMode = b;
			},
			rozaDefaultAccordion: function(list) {
				var hasDefault = false;
				
				for(var x=0; x<list.length; x++) {
					if(this.accessControl(list[x],'ac_default')) {
						hasDefault = true;
						setTimeout(function(){ roza.rozaSetAccordion(list[x]); }); //setTimeout tanpa number bertindak sebagai nextTick
						break;
					}
				}
				
				if(!hasDefault) setTimeout(function(){ roza.rozaSetAccordion(list[0]); }); //setTimeout tanpa number bertindak sebagai nextTick
			},
			rozaDefaultTab: function(list, level) {
				var activated = false;
				
				for(var x=0; x<list.length; x++) {
					if(this.accessControl(list[x],'ac_default')) {
						this.rozaSetTab(list[x], level);
						$('#'+list[x].id).addClass('active');
						activated = true;
					}
				}
				
				//if not set, activate first tab
				if(!activated) {
					this.rozaSetTab(list[0], level);
					setTimeout(function(){
						$('.nav.nav-tabs.level'+level+' li:first').addClass('active');
					}, 1);
				}
			},
			rozaSetAccordion: function(list) {
				if(this.accordionsPrev==list.id) {
					$('#'+list.id).collapse('toggle');
				}
				else {
					this.accordionsPrev = list.id;
					
					$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+list.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
						if(data.status=='ok') {
							for(var x=0; x<data.prop.length; x++) {
								if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
								
								if(data.prop[x].element=='table') {
									roza['vueTable'][data.prop[x].id] = [];
									roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
									roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
									roza['vueTable'][data.prop[x].id]['option'] = {
										columnsClasses: {
											Action: 'action_column',
											CheckAll: 'checkall_column'
										},
										headings: {
											CheckAll: function (h) {
												return h('input', {
													attrs: {
														type: 'checkbox',
														id: 'selectAllCheckbox'
													},
													on: {
														click: (e) => {
															this.selectAll(e.srcElement.checked)
														}
													},
													ref: 'selectAllCheckbox'
												})
											},
											Action: roza.rozaLanguage=='bm'?'Tindakan':'Action'
										}
									};
									
									if(data.prop[x].action_add) {
										roza['vueTable'][data.prop[x].id]['action_add'] = [];
										roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
										roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
										roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
									}
								}
							}
								
							roza.accordions[list.id] = data.prop;
							roza.accordions = JSON.parse(JSON.stringify(roza.accordions));
							roza.$nextTick(function () {
								//$('.panel-collapse.collapse').collapse('hide');
								//$('.accordion-title').addClass('collapsed');
								//$('#'+list.id).prev().removeClass('collapsed');
								//$('#'+list.id).collapse('show');
								
								if(!$('#'+list.id).hasClass('in')) {
									$('.panel-collapse.collapse').removeClass('in');
									$('.accordion-title').addClass('collapsed');
									
									$('#'+list.id).collapse('show');
									$('#'+list.id).prev().removeClass('collapsed');
									
									/*
									$('#'+'acc3').parents('.x_content').scrollTo($('#'+'acc3'), {
										axis: 'y',
										offset: -40,
										duration: 1000
									});
									
									$("html, body").animate({ scrollTop: $('#'+list.id).offset().top }, 1000);
									*/
								}
							});
							
							//roza['accordions'] = JSON.stringify(roza['accordions']);
						}
						else roza.toast(data.status);
					});
				}
			},
			rozaSetTab: function(list, level) {
				$.getJSON('roza/ROZA_GetUi.php?ROZA_UI='+list.ui+(JSON.stringify(this.sessionParam)=='{}'?'':'&'+$.param(this.sessionParam)), function(data){
					if(data.status=='ok') {
						for(var x=0; x<data.prop.length; x++) {
							if(data.prop[x].onload) roza.callbackQue.push(data.prop[x].onload);
							
							if(data.prop[x].element=='table') {
								roza['vueTable'][data.prop[x].id] = [];
								roza['vueTable'][data.prop[x].id]['column'] = data.prop[x].column;
								roza['vueTable'][data.prop[x].id]['list'] = data.prop[x].list;
								roza['vueTable'][data.prop[x].id]['option'] = {
									columnsClasses: {
										Action: 'action_column',
										CheckAll: 'checkall_column'
									},
									headings: {
										CheckAll: function (h) {
											return h('input', {
												attrs: {
													type: 'checkbox',
													id: 'selectAllCheckbox'
												},
												on: {
													click: (e) => {
														this.selectAll(e.srcElement.checked)
													}
												},
												ref: 'selectAllCheckbox'
											})
										},
										Action: roza.rozaLanguage=='bm'?'Tindakan':'Action'
									}
								};
								
								if(data.prop[x].action_add) {
									roza['vueTable'][data.prop[x].id]['action_add'] = [];
									roza['vueTable'][data.prop[x].id]['action_add']['onclick'] = data.prop[x].action_add.onclick;
									roza['vueTable'][data.prop[x].id]['action_add']['ac_remove'] = roza.accessControl(data.prop[x].action_add, 'ac_remove');
									roza['vueTable'][data.prop[x].id]['action_add']['vueTableDualMode'] = roza.accessControl(data.prop[x].action_add, 'ac_dualmode')?'vueTableDualMode':'';
								}
							}
							
							//set default tab in tab
							else if(level==1 && data.prop[x].element=='tabs') {
								roza.rozaDefaultTab(data.prop[x].list, 2);
							}
						}
							
						roza['tabLevel'+level] = data.prop;
					}
					else roza.toast(data.status);
				});
			},
			timelineDetail: function(step) {
				if(!step.ROZA_TIME || !step.info) return false;
				
				var content = '<div class="x_panel" style="margin-bottom:0"><div class="x_content p-0"><div data-parsley-validate="" class="form-horizontal form-label-left">';
				for(x=0; x<step.info.length; x++) content += '<div class="form-group"><label class="control-label col-xs-3">'+step.info[x]['label'+this.rozaLanguage]+'</label><div class="col-xs-9"><div contentEditable class="form-control ac_disable">'+step.info[x]['value']+'</div></div></div>';
				content += '</div></div></div>';

				this.rozaModal({
					titlebm: step.ROZA_TITLE,
					titlebi: step.ROZA_TITLE,
					contentbm: content,
					contentbi: content
				});
			},
			exportModal: function(onexport) {
				var content = '<div class="export-container"><div class="export-box" onclick="'+onexport.pdf+'"><div class="export-circle" style="background:#D42839"><i class="fa fa-file-pdf-o"></i></div>PDF</div>';
				if(onexport.word) content += '<div class="export-box" onclick="'+onexport.word+'"><div class="export-circle" style="background:#295391"><i class="fa fa-file-word-o"></i></div>Word</div>';
				if(onexport.excel) content += '<div class="export-box" onclick="'+onexport.excel+'"><div class="export-circle" style="background:#1F6B41"><i class="fa fa-file-excel-o"></i></div>Excel</div>';
				content += '</div>';
				
				this.rozaModal({
					titlebm: 'Pilih Jenis Eksport',
					titlebi: 'Choose Export Type',
					contentbm: content,
					contentbi: content
				});
			},
			setBreadcrumbBuffer: function(level, module) {
				var b = this.breadcrumbBuffer.split('<br>');
				b.splice(level-1);
				b.push('<li class="breadcrumb-item"><a>'+module+'</a></li>');
				this.breadcrumbBuffer = b.join('<br>');
			},
			globalSearch: function(event) {
				if(event.key=='Enter' || event.type=='click') {
					this.breadcrumb = '<li class="breadcrumb-item"><a>Search result for "'+this.globalSearchKeyword+'"</a></li>';
					this.panel.fullPanel.type = 'custompage_searchresult';
					this.panel.fullPanel.show = true;
					this.panel.leftPanel.show = false;
					this.panel.leftPanel.show = false;
					this.panel.rightPanel.show = false;
					this.activeMetro = 'globalSearch';
					this.rozaSetTaskbar();
				}
			},
			getMenu: function() {
				$.getJSON('roza/ROZA_GetMenu.php', function(data){
					if(data.status=='ok') roza.menu.list = data.data;
					else if(data.status=='invalid session') window.location = './';
					else roza.toast(data.status);
				});
			},
			confTheme: function() {
				if($('#confTheme').val()==null) $('#confTheme').val('theme-night-sky');
				this.conf.theme = $('#confTheme').val();
				$('#theme').attr('href', 'css/'+this.conf.theme+'.css?'+currentVersion);
				localStorage.setItem(prefix+'conf', JSON.stringify(this.conf));
			},
			rozaEqualPanel: function() {
				$('#leftPanel').addClass('equalPanel');
			},
			updateBulkCount: function(e) {
				var bulkCount = e.parents('table').find('tbody [type=checkbox]:checked').length;
				if(!bulkCount) {
					e.parents('table').find('span.bulk_toggle').addClass('transparent');
					e.parents('table').find('th.bulk_toggle').removeClass('transparent');
				}
				else {
					e.parents('table').find('span.bulk_toggle').removeClass('transparent');
					e.parents('table').find('th.bulk_toggle').addClass('transparent');
				}
				e.parents('table').find('#bulkCount').text(bulkCount);
			},
			checkboxEvent: function(table) {
				$('table .checkall').on('ifClicked', function(event){
					var _this = this;
					setTimeout(function(){
						$(_this).parents('table').find('tbody [type=checkbox]').iCheck(event.currentTarget.checked?'check':'uncheck');
						roza.updateBulkCount($(_this));
					}, 1);
				});
				
				$('tbody [type=checkbox]').on('ifClicked', function(event){
					var _this = this;
					setTimeout(function(){
						$(_this).parents('table').find('thead .checkall').iCheck($(_this).parents('table').find('tbody [type=checkbox]:checked').length == $(_this).parents('table').find('tbody [type=checkbox]').length?'check':'uncheck');
						roza.updateBulkCount($(_this));
					}, 1);
				});
			},
			maxlength: function(item) {
				$('#'+item.id).text($('#'+item.id).text().substring(0, item.maxlength));

				var range, selection;
				if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
				{
					range = document.createRange();//Create a range (a range is a like the selection but invisible)
					range.selectNodeContents($('#'+item.id)[0]);//Select the entire contents of the element with the range
					range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
					selection = window.getSelection();//get the selection object (allows you to change selection)
					selection.removeAllRanges();//remove any selections already made
					selection.addRange(range);//make the range you have just created the visible selection
				}
				else if(document.selection)//IE 8 and lower
				{ 
					range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
					range.moveToElementText($('#'+item.id)[0]);//Select the entire contents of the element with the range
					range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
					range.select();//Select the range (make it the visible selection
				}
			},
			showDashboard: function() {
				this.page = 'dashboard';
				setTimeout(function(){ initMorris(); }, 50);
				
				//reload standardlist task
				//===========================================================================================================
				$.getJSON('roza/ROZA_GetUi.php?ROZA_UI=dashboard/Standardlist_Task.json', function(data){
					if(data.status=='ok') {
						roza.viewMode = true;
						
						roza.panel.dashboardTask.prop = data.prop;

					}
					else roza.toast(data.status);
				});
				//===========================================================================================================
				
			}
		},
		created: function() {
			
			//development only
			this.rozaUserRole = localStorage.getItem('ILIMS_rozaUserRole').split(',').map(function(role){ return role.trim() });
			
			rozaUserId = this.rozaUserId;
			rozaUserName = this.rozaUserName;
			rozaUserRole = this.rozaUserRole;
			rozaLanguage = this.rozaLanguage;
			rozaCallLandingFile = this.rozaCallLandingFile;
			rozaSetTaskbar = this.rozaSetTaskbar;
			rozaSetPanel = this.rozaSetPanel;
			rozaViewMode = this.rozaViewMode;
			rozaBindData = this.rozaBindData;
			rozaBindLov = this.rozaBindLov;
			rozaGetParam = this.rozaGetParam;
			rozaModal = this.rozaModal;
			rozaClearData = this.rozaClearData;
			rozaResetData = this.rozaResetData;
			//rozaSubmitData = this.rozaSubmitData;
			rozaHasRole = this.rozaHasRole;
			rozaEqualPanel = this.rozaEqualPanel;
		},
		updated: function() {
			//======================================================================================================== iCheck start
			$('input.flat').iCheck({
				checkboxClass: 'icheckbox_flat-green',
				radioClass: 'iradio_flat-green'
			});
			//======================================================================================================== iCheck end
			
			//======================================================================================================== DataTables start
			console.log('update. found new table: '+$('.table:not(.dataTable)').length);
			$('.table:not(.dataTable)').each(function(){
				
				$(this).DataTable({
					'language': {
						lengthMenu: roza.rozaLanguage=='bm'?'Papar _MENU_':'Display _MENU_',
						zeroRecords: roza.rozaLanguage=='bm'?'Tiada rekod':'No records',
						info: roza.rozaLanguage=='bm'?'Paparan _START_ hingga _END_ daripada _MAX_ rekod':'Show _START_ to _END_ of _MAX_ records',
						infoEmpty: '',
						infoFiltered: '',
						search: roza.rozaLanguage=='bm'?'Carian ':'Search ',
						paginate: {
							next: '&#9655;',
							previous: '&#9665;'
						}
					},
					'order': [],
					'columnDefs': [{'targets': 'nosort', 'orderable': false}]
				}).on('draw', function(e) {
					roza.checkboxEvent();
					$(e.currentTarget).find('[type=checkbox]').iCheck('uncheck');
					roza.updateBulkCount($(e.currentTarget).find('.checkall'));
				})

				$('.dataTable .searchcolumn').on('input', function() {
					console.log('table id: '+$(this).parents('table').attr('id'));
					console.log('col index: '+$(this).parent().index());
					roza.dataTable[$(this).parents('table').attr('id')].column($(this).parent().index()).search($(this).val()).draw();
				});
			});

			roza.checkboxEvent();
			//======================================================================================================== DataTables end
			
			//======================================================================================================== datepicker start
			$('.date [data-style="single"]').daterangepicker({
				singleDatePicker: true,
				locale: {
					format: 'DD/MM/YYYY'
				}
			}, function(start, end, label) {
				//console.log(start.toISOString(), end.toISOString(), label);
			});
			
			$('.date [data-style="range"]').daterangepicker({
				locale: {
					format: 'DD/MM/YYYY'
				}
			}, function(start, end, label) {
				//console.log(start.toISOString(), end.toISOString(), label);
			});
			//======================================================================================================== datepicker end

			$('.dropzone').each(function(){
				if($(this).find('.dz-default').size()==0) {
					$(this).dropzone({
						url: 'main.html',
						createImageThumbnails: false,
						ignoreHiddenFiles: true,
						addRemoveLinks: true,
						dictRemoveFile: 'x',
						removedfile: function(file) {
							var _ref;
							return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
						}
					});
				}
			});
			
			//======================================================================================================== element callback start
			while (this.callbackQue.length) {
				var callback = this.callbackQue.shift();
				try {
					eval(callback);
				}
				catch(err) {
					$.getJSON('roza/ROZA_LogError.php?msg='+err.message+': '+callback, function(data) {
						roza.toast('System error occured and has been reported ('+data.log_id+')');
					});
				}
			}
			//======================================================================================================== element callback end
			
			//======================================================================================================== live search in dropdown start
			$('select:not(.ac_disable)').each(function(){
				$(this).selectpicker({
					liveSearch: $(this).hasClass('searchable')
				});
			});
			$('select.ac_disable').selectpicker('destroy');
			//======================================================================================================== live search in dropdow<end></end>nd
		},
		mounted: function() {
			this.$nextTick(function () {
				//===========================================================Side Menu
				/*
				$('.side-menu a').click(function(){
					var level = $(this).attr('menu-level');
					var id = $(this).attr('menu-id');
					
					if($(this).parent().is('.active')) {
						$(this).parent().removeClass('active');
						$(this).parent().find('ul').slideUp();
					}
					else {
						$('[menu-level='+level+']').parent().removeClass('active');
						$('.side-menu li').not('.active').find('.active').removeClass('active');
						$('[menu-level='+level+']').parent().find('ul').slideUp();
						$(this).parent().addClass('active');
						$(this).parent().children('ul').slideDown();
					}
				});
				*/
				//====================================================================

				$('#leftPanel').width(roza.conf.panelsize);
				
				$('#leftPanel').resizable({
					handles: "e",
					resize: function(event, ui) {
						roza.conf.panelsize = ui.size.width;
						localStorage.setItem(prefix+'conf', JSON.stringify(roza.conf));
					}
				});
				
				$('.ui-resizable-handle').dblclick(function(){
					roza.conf.panelsize = 400;
					localStorage.setItem(prefix+'conf', JSON.stringify(roza.conf));
					$('#leftPanel').width(roza.conf.panelsize);
				});

				$('.metro-menu-opener').mouseenter(function(){
					$('.metro-menu-opener').addClass('active');
				});
				$('.metro-menu-closer').mouseenter(function(){
					$('.metro-menu-opener').removeClass('active');
				});
				
				$('#globalSearch').devbridgeAutocomplete({
					lookup: [{value:'Khairul Bahar'}, {value:'Akta Merbahaya'}, {value:'Bahasa Melayu Teras Kejayaan'}],
					onSelect: function (suggestion) {
						$('#globalSearch').focus();
					}
				});
				
				this.getMenu();
				
				$('#confTheme').val(this.conf.theme);
				this.confTheme();
				
				$('body').css('opacity',1);
				
				if(this.rozaVersion != currentVersion) {
					$('#fetchWhatsNew').load('manual', function(){
						roza.rozaVersion = currentVersion;
						localStorage.setItem(prefix+'rozaVersion', currentVersion);
						roza.rozaModal({
							contentbm: $('#fetchWhatsNew #fetchWhatsNew').html().replace(/<a /gi, '<span '),
							contentbm: $('#fetchWhatsNew #fetchWhatsNew').html().replace(/<a /gi, '<span ')
						});
						$('#modalGeneral h2').css('margin-top', '0');
						$('#fetchWhatsNew').html('');
					});
				}

			});
		}
	});
};

function advanceIsDatepicker(e) {
	if($(e).find(':selected').attr('element')=='datepicker') {
		$(e).parent().find('.adv3').val('');
		$(e).parent().find('.adv3').daterangepicker({
			singleDatePicker: true,
			locale: {
				format: 'DD/MM/YYYY'
			}
		}, function(start, end, label) {
			//console.log(start.toISOString(), end.toISOString(), label);
		});
	}
	else {
		if($(e).parent().find('.adv3').data('daterangepicker')) {
			$(e).parent().find('.adv3').data('daterangepicker').remove();
			console.log('destroyed');
		}
	}
}

/*

function debounce(func, wait, immediate) {
	var __timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			__timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !__timeout;
		clearTimeout(__timeout);
		__timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function addFavourite_BAK() {
	$('#modalFavourite').modal({
		show: true,
		backdrop: 'static'
	});
}

rozaChangeFilter_BAK: $.debounce(function(e) {
	roza[e].filterString = $('#'+e+' #rozaFilter').val();
}, 300)

rozaContain_BAK: function(string, key) {
	console.log(string);
	console.log(key);
	return string.toUpperCase().indexOf(key.toUpperCase())>-1;
}

matchArguments_BAK: function(a) {
	var result = true;
	if(a.callee.length != a.length) {
		result = false;
		this.toast('Expecting '+a.callee.length+' arguments for '+a.callee.toString().split(' {')[0].replace('function ', a.callee.name).replace(/ /g,''));
	}
	return result;
}
rozaBindData_BAK: function(panel, bl, callback) {
	$.getJSON('dev/php/'+bl, function(data){
			if(data.status=='ok') {
				$.each(JSON.parse(data.data), function(k, v) {
					$('[name="'+k+'"]').val(v);
					$('[name="'+k+'"]').attr('data-value', v);
				});
				if(callback) callback(data);
			}
			else roza.toast(data.status);
	}).fail(function(){
		roza.toast(bl+': Not found');
	});
}

rozaBindLov_BAK: function(selector, bl, callback) {
	$.getJSON('dev/php/'+bl, function(data){
			if(data.status=='ok') {
				var html = '';
				var target = $('[name="'+selector+'"]');
				if(target[0].tagName=='SELECT') {
					var lov = JSON.parse(data.data);
					for(var i=0; i<lov.length; i++) {
						html += '<option value="'+lov[i].value+'" '+(target.attr('data-value')==lov[i].value?'selected':'')+'>'+lov[i]['label'+roza.rozaLanguage]+'</option>';
					}
					$('[name="'+selector+'"]').html(html);
				}
				else {
					roza.toast('rozaBindLov: Element type '+target[0].tagName+' not supported');
				}
				if(callback) callback(data);
			}
			else roza.toast(data.status);
	}).fail(function(){
		roza.toast(bl+': Not found');
	});
}
*/