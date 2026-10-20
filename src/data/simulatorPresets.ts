/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IESimulatorPreset, HandoffCheckItem, LineHandoffSignoff, OperationStep, MachineRequirement } from '../types';

export const SIMULATOR_PRESETS: IESimulatorPreset[] = [
  {
    id: 'preset-tshirt',
    styleName: 'TS-2401 Crewneck Basic',
    buyer: 'H&M',
    garmentCategory: 'Knitwear / T-Shirt',
    totalSMV: 12.5,
    recommendedOperators: 28,
    recommendedHelpers: 6,
    recommendedIroners: 2,
    operations: [
      {
        id: 'op-1',
        opNo: 1,
        name: 'Back neck tape prep & cut',
        section: 'preparation',
        machineType: 'Manual / Tape Cutter',
        smvSec: 18,
        operators: 1,
        cycleTimeSec: 18,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Auto tape dispenser',
        operatorGrade: 'B'
      },
      {
        id: 'op-2',
        opNo: 2,
        name: 'Shoulder join with mobilon tape',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 25,
        operators: 1,
        cycleTimeSec: 25,
        pitchStatus: 'ok',
        folderOrAttachment: 'Clear elastic mobilon guide',
        operatorGrade: 'A'
      },
      {
        id: 'op-3',
        opNo: 3,
        name: 'Rib collar loop prep & join',
        section: 'preparation',
        machineType: 'SNLS with trimmer',
        smvSec: 22,
        operators: 1,
        cycleTimeSec: 22,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Rib gauge stop',
        operatorGrade: 'B'
      },
      {
        id: 'op-4',
        opNo: 4,
        name: 'Neck rib attach to body neckline',
        section: 'assembly',
        machineType: '4-Thread Overlock Cylinder',
        smvSec: 32,
        operators: 1,
        cycleTimeSec: 32,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Pneumatic collar stretcher',
        operatorGrade: 'A'
      },
      {
        id: 'op-5',
        opNo: 5,
        name: 'Neckline topstitch / coverstitch',
        section: 'assembly',
        machineType: 'SNLS / 2-Needle Chainstitch',
        smvSec: 27,
        operators: 1,
        cycleTimeSec: 27,
        pitchStatus: 'ok',
        folderOrAttachment: 'Compensating presser foot',
        operatorGrade: 'A'
      },
      {
        id: 'op-6',
        opNo: 6,
        name: 'Back neck tape attach & edge close',
        section: 'assembly',
        machineType: 'SNLS with puller',
        smvSec: 34,
        operators: 1,
        cycleTimeSec: 34,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Herringbone tape swing folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-7',
        opNo: 7,
        name: 'Sleeve hem folding & flatlock stitch',
        section: 'preparation',
        machineType: '3-Needle Flatlock Bed',
        smvSec: 24,
        operators: 1,
        cycleTimeSec: 24,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Auto hemming guide',
        operatorGrade: 'B'
      },
      {
        id: 'op-8',
        opNo: 8,
        name: 'Sleeve to armhole join (Left & Right)',
        section: 'assembly',
        machineType: '4-Thread Overlock Heavy',
        smvSec: 38,
        operators: 2,
        cycleTimeSec: 19,
        pitchStatus: 'ok',
        folderOrAttachment: 'Differential feed calibrated',
        operatorGrade: 'A'
      },
      {
        id: 'op-9',
        opNo: 9,
        name: 'Side seam close with care label insertion',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 42,
        operators: 2,
        cycleTimeSec: 21,
        pitchStatus: 'ok',
        folderOrAttachment: 'Label insertion gauge',
        operatorGrade: 'B'
      },
      {
        id: 'op-10',
        opNo: 10,
        name: 'Bottom hem folding & 3-needle flatlock',
        section: 'assembly',
        machineType: '3-Needle Flatlock Cylinder Bed',
        smvSec: 28,
        operators: 1,
        cycleTimeSec: 28,
        pitchStatus: 'ok',
        folderOrAttachment: 'Cylinder hemmer folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-11',
        opNo: 11,
        name: 'Thread trimming & inspection audit',
        section: 'finishing',
        machineType: 'Manual / Vacuum trimmer',
        smvSec: 22,
        operators: 1,
        cycleTimeSec: 22,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Pneumatic thread suction',
        operatorGrade: 'C'
      }
    ],
    machines: [
      { type: '4-Thread Overlock', name: 'Juki MO-6814S', requiredCount: 8, installedCount: 8, calibratedCount: 8, gaugeSpec: '2x4mm gauge' },
      { type: 'Single Needle Lockstitch (SNLS)', name: 'Juki DDL-9000C', requiredCount: 7, installedCount: 7, calibratedCount: 7, gaugeSpec: 'Standard DBx1' },
      { type: '3-Needle Flatlock Cylinder', name: 'Yamato VG2700', requiredCount: 5, installedCount: 5, calibratedCount: 4, gaugeSpec: '5.6mm needle gauge' },
      { type: '3-Needle Flatlock Flat Bed', name: 'Pegasus W500PV', requiredCount: 4, installedCount: 4, calibratedCount: 4, gaugeSpec: '6.4mm needle gauge' },
      { type: 'Underpress / Iron Table', name: 'Veit Varioset', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Steam 4.5 bar' }
    ]
  },
  {
    id: 'preset-polo',
    styleName: 'PL-3302 Pique Polo Shirt',
    buyer: 'Gap',
    garmentCategory: 'Polo Shirt / Knitwear',
    totalSMV: 18.8,
    recommendedOperators: 36,
    recommendedHelpers: 8,
    recommendedIroners: 3,
    operations: [
      {
        id: 'op-polo-1',
        opNo: 1,
        name: 'Placket fusing & creasing',
        section: 'preparation',
        machineType: 'Iron / Creasing Jig',
        smvSec: 24,
        operators: 1,
        cycleTimeSec: 24,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Box placket heating template',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-2',
        opNo: 2,
        name: 'Front neck slit cutting & box placket attach',
        section: 'assembly',
        machineType: 'SNLS with edge guide',
        smvSec: 46,
        operators: 2,
        cycleTimeSec: 23,
        pitchStatus: 'ok',
        folderOrAttachment: 'Split knife slit cutter',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-3',
        opNo: 3,
        name: 'Placket bottom box close & cross-x stitch',
        section: 'assembly',
        machineType: 'SNLS',
        smvSec: 36,
        operators: 1,
        cycleTimeSec: 36,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Square box transparent template',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-4',
        opNo: 4,
        name: 'Shoulder join with stay tape',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 28,
        operators: 1,
        cycleTimeSec: 28,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Framed tape feeder',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-5',
        opNo: 5,
        name: 'Flat knit rib collar join to neck',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 38,
        operators: 1,
        cycleTimeSec: 38,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Center collar notch aligner',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-6',
        opNo: 6,
        name: 'Neck band binding & clean topstitch',
        section: 'assembly',
        machineType: 'SNLS Chainstitch',
        smvSec: 35,
        operators: 1,
        cycleTimeSec: 35,
        pitchStatus: 'ok',
        folderOrAttachment: 'Collar piping folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-7',
        opNo: 7,
        name: 'Sleeve cuff rib attach',
        section: 'preparation',
        machineType: '4-Thread Overlock Cylinder',
        smvSec: 30,
        operators: 1,
        cycleTimeSec: 30,
        pitchStatus: 'ok',
        folderOrAttachment: 'Cylinder sleeve stretcher',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-8',
        opNo: 8,
        name: 'Sleeve to body armhole join',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 42,
        operators: 2,
        cycleTimeSec: 21,
        pitchStatus: 'ok',
        folderOrAttachment: 'Differential feed',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-9',
        opNo: 9,
        name: 'Side seam with side slit vent tape',
        section: 'assembly',
        machineType: '4-Thread Overlock',
        smvSec: 48,
        operators: 2,
        cycleTimeSec: 24,
        pitchStatus: 'ok',
        folderOrAttachment: 'Twill tape insertion folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-polo-10',
        opNo: 10,
        name: 'Side slit box finish & bartack',
        section: 'assembly',
        machineType: 'Electronic Bartack',
        smvSec: 26,
        operators: 1,
        cycleTimeSec: 26,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Slit clamp plate',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-11',
        opNo: 11,
        name: 'Bottom hem folding & 2-needle stitch',
        section: 'assembly',
        machineType: 'Flatlock Bed',
        smvSec: 30,
        operators: 1,
        cycleTimeSec: 30,
        pitchStatus: 'ok',
        folderOrAttachment: 'Spring hem guide',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-12',
        opNo: 12,
        name: 'Buttonhole indexer (2 holes on placket)',
        section: 'finishing',
        machineType: 'Auto Buttonhole Indexer',
        smvSec: 24,
        operators: 1,
        cycleTimeSec: 24,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Laser alignment dot',
        operatorGrade: 'B'
      },
      {
        id: 'op-polo-13',
        opNo: 13,
        name: 'Button sew (2 buttons with cross stitch)',
        section: 'finishing',
        machineType: 'Electronic Button Sewer',
        smvSec: 22,
        operators: 1,
        cycleTimeSec: 22,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Button hopper feed',
        operatorGrade: 'C'
      },
      {
        id: 'op-polo-14',
        opNo: 14,
        name: '100% End-line inspection & measurement check',
        section: 'finishing',
        machineType: 'QC Audit Table',
        smvSec: 28,
        operators: 1,
        cycleTimeSec: 28,
        pitchStatus: 'ok',
        folderOrAttachment: 'Calibrated measuring tape',
        operatorGrade: 'A'
      }
    ],
    machines: [
      { type: 'Single Needle Lockstitch (SNLS)', name: 'Juki DDL-9000C', requiredCount: 10, installedCount: 10, calibratedCount: 10, gaugeSpec: 'Standard DBx1 #11' },
      { type: '4-Thread Overlock', name: 'Juki MO-6814S', requiredCount: 12, installedCount: 12, calibratedCount: 11, gaugeSpec: '2x4mm gauge needle' },
      { type: 'Flatlock Machine', name: 'Yamato VG2700', requiredCount: 6, installedCount: 6, calibratedCount: 6, gaugeSpec: '5.6mm gauge' },
      { type: 'Electronic Buttonhole', name: 'Brother HE-800B', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Direct drive indexer' },
      { type: 'Electronic Button Sewer', name: 'Brother CB3-B917', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Vibration hopper' },
      { type: 'Electronic Bartack', name: 'Juki LK-1900BN', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Standard clamp' }
    ]
  },
  {
    id: 'preset-jeans',
    styleName: 'DN-501 5-Pocket Denim',
    buyer: 'Levi\'s',
    garmentCategory: 'Denim & Bottoms',
    totalSMV: 24.5,
    recommendedOperators: 48,
    recommendedHelpers: 10,
    recommendedIroners: 4,
    operations: [
      {
        id: 'op-j-1',
        opNo: 1,
        name: 'Front pocket bag facing attach',
        section: 'preparation',
        machineType: '5-Thread Safety Stitch',
        smvSec: 26,
        operators: 1,
        cycleTimeSec: 26,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Edge trimmer guide',
        operatorGrade: 'B'
      },
      {
        id: 'op-j-2',
        opNo: 2,
        name: 'Coin pocket hem & attach with rivets',
        section: 'preparation',
        machineType: 'Twin Needle Lockstitch',
        smvSec: 36,
        operators: 1,
        cycleTimeSec: 36,
        pitchStatus: 'ok',
        folderOrAttachment: 'Coin pocket acrylic template',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-3',
        opNo: 3,
        name: 'Back pocket decorative arcuate embroidery',
        section: 'preparation',
        machineType: 'CNC Pattern Sewer',
        smvSec: 32,
        operators: 1,
        cycleTimeSec: 32,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Twin clamping clamp',
        operatorGrade: 'B'
      },
      {
        id: 'op-j-4',
        opNo: 4,
        name: 'Back pocket hem folding & double stitch',
        section: 'preparation',
        machineType: 'Twin Needle Lockstitch',
        smvSec: 34,
        operators: 1,
        cycleTimeSec: 34,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Roll hemmer',
        operatorGrade: 'B'
      },
      {
        id: 'op-j-5',
        opNo: 5,
        name: 'Back pocket positioning & attach to back panel',
        section: 'assembly',
        machineType: 'Twin Needle with corner cutter',
        smvSec: 54,
        operators: 2,
        cycleTimeSec: 27,
        pitchStatus: 'ok',
        folderOrAttachment: 'Laser locator + corner folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-6',
        opNo: 6,
        name: 'Back yoke join (Left & Right)',
        section: 'assembly',
        machineType: '3-Needle Feed Off The Arm (FOA)',
        smvSec: 42,
        operators: 1,
        cycleTimeSec: 42,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Heavy denim lap seam folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-7',
        opNo: 7,
        name: 'Back rise join with double chainstitch',
        section: 'assembly',
        machineType: '3-Needle FOA Chainstitch',
        smvSec: 36,
        operators: 1,
        cycleTimeSec: 36,
        pitchStatus: 'ok',
        folderOrAttachment: 'Curved lap seam folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-8',
        opNo: 8,
        name: 'Front zipper fly attach & J-stitch topstitch',
        section: 'assembly',
        machineType: 'Twin Needle SNLS Heavy',
        smvSec: 48,
        operators: 2,
        cycleTimeSec: 24,
        pitchStatus: 'ok',
        folderOrAttachment: 'J-stitch acrylic magnetic guide',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-9',
        opNo: 9,
        name: 'Inseam join with heavy chainstitch',
        section: 'assembly',
        machineType: '3-Needle FOA Chainstitch',
        smvSec: 44,
        operators: 2,
        cycleTimeSec: 22,
        pitchStatus: 'ok',
        folderOrAttachment: 'Pneumatic puller + lap folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-10',
        opNo: 10,
        name: 'Outseam safety stitch & pressing',
        section: 'assembly',
        machineType: '5-Thread Heavy Overlock',
        smvSec: 46,
        operators: 2,
        cycleTimeSec: 23,
        pitchStatus: 'ok',
        folderOrAttachment: 'Reinforced needle plate',
        operatorGrade: 'B'
      },
      {
        id: 'op-j-11',
        opNo: 11,
        name: 'Continuous waistband attach & chain pull',
        section: 'assembly',
        machineType: 'Kansai Special 4-Needle Chainstitch',
        smvSec: 38,
        operators: 1,
        cycleTimeSec: 38,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Heavy waistband binder folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-12',
        opNo: 12,
        name: 'Waistband corner finish & belt loops (5 loops)',
        section: 'assembly',
        machineType: 'Auto Belt Loop Setter',
        smvSec: 40,
        operators: 1,
        cycleTimeSec: 40,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Auto loop cutting & feed unit',
        operatorGrade: 'A'
      },
      {
        id: 'op-j-13',
        opNo: 13,
        name: 'Bottom leg hem roll stitching',
        section: 'assembly',
        machineType: 'Lockstitch Cylinder Bed Hemmer',
        smvSec: 32,
        operators: 1,
        cycleTimeSec: 32,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Spring denim hem folder',
        operatorGrade: 'B'
      },
      {
        id: 'op-j-14',
        opNo: 14,
        name: 'Keyhole buttonhole & metal shank rivet',
        section: 'finishing',
        machineType: 'Eyelet Buttonhole + Auto Rivet Press',
        smvSec: 30,
        operators: 1,
        cycleTimeSec: 30,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Pneumatic rivet feeder',
        operatorGrade: 'C'
      }
    ],
    machines: [
      { type: 'Feed Off The Arm (FOA)', name: 'Juki MS-1261', requiredCount: 6, installedCount: 6, calibratedCount: 6, gaugeSpec: '1/4" lap folder heavy' },
      { type: 'Twin Needle Lockstitch', name: 'Brother T-8422C', requiredCount: 8, installedCount: 8, calibratedCount: 7, gaugeSpec: '1/4" gauge, heavy needle #18' },
      { type: '5-Thread Safety Overlock', name: 'Pegasus EXT5214', requiredCount: 8, installedCount: 8, calibratedCount: 8, gaugeSpec: '5x5mm safety stitch' },
      { type: 'Kansai Waistband Machine', name: 'Kansai DLR-1508PR', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: '4-needle 1/4" gauge' },
      { type: 'Auto Belt Loop Machine', name: 'Juki MOL-254', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Auto loop feed' },
      { type: 'Eyelet Keyhole Buttonhole', name: 'Juki MEB-3200', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Electronic taper bar' }
    ]
  },
  {
    id: 'preset-shirt',
    styleName: 'WS-801 Classic Woven Shirt',
    buyer: 'Zara',
    garmentCategory: 'Woven Formal & Casual',
    totalSMV: 22.0,
    recommendedOperators: 42,
    recommendedHelpers: 8,
    recommendedIroners: 3,
    operations: [
      {
        id: 'op-s-1',
        opNo: 1,
        name: 'Collar leaf runstitch & edge trim',
        section: 'preparation',
        machineType: 'SNLS with auto trimmer',
        smvSec: 32,
        operators: 1,
        cycleTimeSec: 32,
        pitchStatus: 'ok',
        folderOrAttachment: 'Point turning template',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-2',
        opNo: 2,
        name: 'Collar point turning & pneumatic pressing',
        section: 'preparation',
        machineType: 'Pneumatic Point Turner',
        smvSec: 20,
        operators: 1,
        cycleTimeSec: 20,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Heating collar press mold',
        operatorGrade: 'B'
      },
      {
        id: 'op-s-3',
        opNo: 3,
        name: 'Collar band attach & sandwich stitch',
        section: 'preparation',
        machineType: 'SNLS',
        smvSec: 35,
        operators: 1,
        cycleTimeSec: 35,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Band notch centering guide',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-4',
        opNo: 4,
        name: 'Front placket runstitch & double edge stitch',
        section: 'preparation',
        machineType: 'Twin Needle Lockstitch',
        smvSec: 42,
        operators: 2,
        cycleTimeSec: 21,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Woven placket swing folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-5',
        opNo: 5,
        name: 'Front chest pocket hem & body attach',
        section: 'assembly',
        machineType: 'Pattern Stitcher / SNLS',
        smvSec: 48,
        operators: 2,
        cycleTimeSec: 24,
        pitchStatus: 'ok',
        folderOrAttachment: 'Magnetic pocket template',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-6',
        opNo: 6,
        name: 'Back yoke join with double pleats',
        section: 'assembly',
        machineType: 'SNLS / Feed Off The Arm',
        smvSec: 38,
        operators: 1,
        cycleTimeSec: 38,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Yoke pleat guide stop',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-7',
        opNo: 7,
        name: 'Shoulder join with clean finish seam',
        section: 'assembly',
        machineType: 'Twin Needle Chainstitch FOA',
        smvSec: 34,
        operators: 1,
        cycleTimeSec: 34,
        pitchStatus: 'ok',
        folderOrAttachment: 'Felled seam folder',
        operatorGrade: 'B'
      },
      {
        id: 'op-s-8',
        opNo: 8,
        name: 'Collar join to neckband & close stitch',
        section: 'assembly',
        machineType: 'SNLS Fine Needle',
        smvSec: 46,
        operators: 2,
        cycleTimeSec: 23,
        pitchStatus: 'ok',
        folderOrAttachment: 'Edge compensator foot',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-9',
        opNo: 9,
        name: 'Sleeve placket / gauntlet attach (Left & Right)',
        section: 'preparation',
        machineType: 'Auto Sleeve Placket Machine',
        smvSec: 40,
        operators: 1,
        cycleTimeSec: 40,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Laser placket clamp',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-10',
        opNo: 10,
        name: 'Sleeve join to body armhole',
        section: 'assembly',
        machineType: 'FOA Felled Seam',
        smvSec: 38,
        operators: 1,
        cycleTimeSec: 38,
        pitchStatus: 'bottleneck',
        folderOrAttachment: 'Lap seam folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-11',
        opNo: 11,
        name: 'Side seam & underarm close',
        section: 'assembly',
        machineType: 'FOA 2-Needle Chainstitch',
        smvSec: 44,
        operators: 2,
        cycleTimeSec: 22,
        pitchStatus: 'ok',
        folderOrAttachment: 'Arm lap folder',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-12',
        opNo: 12,
        name: 'Cuff attach & edge stitch (Left & Right)',
        section: 'assembly',
        machineType: 'SNLS with folder',
        smvSec: 42,
        operators: 2,
        cycleTimeSec: 21,
        pitchStatus: 'ok',
        folderOrAttachment: 'Cuff guide plate',
        operatorGrade: 'A'
      },
      {
        id: 'op-s-13',
        opNo: 13,
        name: 'Bottom hem curve rolled edge stitch',
        section: 'assembly',
        machineType: 'SNLS with rolled hemmer',
        smvSec: 30,
        operators: 1,
        cycleTimeSec: 30,
        pitchStatus: 'underloaded',
        folderOrAttachment: 'Curved hem roll folder 1/8"',
        operatorGrade: 'B'
      },
      {
        id: 'op-s-14',
        opNo: 14,
        name: 'Auto buttonhole & button sew line (7 front + 4 cuffs)',
        section: 'finishing',
        machineType: 'Auto Indexing Button Line',
        smvSec: 36,
        operators: 1,
        cycleTimeSec: 36,
        pitchStatus: 'ok',
        folderOrAttachment: 'Laser spacer guide',
        operatorGrade: 'B'
      }
    ],
    machines: [
      { type: 'Single Needle Lockstitch (SNLS)', name: 'Juki DDL-9000C', requiredCount: 16, installedCount: 16, calibratedCount: 16, gaugeSpec: 'Fine needle #9-11' },
      { type: 'Feed Off The Arm (FOA)', name: 'Juki MS-1190', requiredCount: 6, installedCount: 6, calibratedCount: 6, gaugeSpec: '1/8" double lap seam' },
      { type: 'Twin Needle Lockstitch', name: 'Brother T-8422C', requiredCount: 4, installedCount: 4, calibratedCount: 4, gaugeSpec: '1/4" needle gauge' },
      { type: 'Auto Sleeve Placket Setter', name: 'Juki AP-876', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Triangular gauntlet mold' },
      { type: 'Electronic Buttonhole Indexer', name: 'Brother HE-800B', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Direct drive 120mm' },
      { type: 'Electronic Button Attacher', name: 'Juki MB-1800', requiredCount: 2, installedCount: 2, calibratedCount: 2, gaugeSpec: 'Hopper feeder' }
    ]
  }
];

export const DEFAULT_HANDOFF_CHECKLIST: HandoffCheckItem[] = [
  {
    id: 'hc-1',
    category: 'machine_mechanical',
    item: 'Machine Layout & Table Positioning',
    standard: 'Line setup strictly matches IE technical floor diagram; table heights leveled at 820mm.',
    status: 'pass',
    responsible: 'Maintenance Foreman',
    notes: 'All 28 tables locked with anti-vibration pads.'
  },
  {
    id: 'hc-2',
    category: 'machine_mechanical',
    item: 'Motor RPM, Needle Timing & Thread Tension',
    standard: 'Servo motors calibrated to 4,200 RPM max; zero needle heat discoloration; tension balanced 120-140cN.',
    status: 'pass',
    responsible: 'Line Mechanic',
    notes: 'Checked with electronic tension gauge.'
  },
  {
    id: 'hc-3',
    category: 'attachments_jigs',
    item: 'Folders, Swing Binders & Gauge Stops',
    standard: '100% designated folders installed with micro-adjust thumb screws; clear tape guides checked.',
    status: 'pass',
    responsible: 'IE Tooling Specialist',
    notes: 'Mobilon guide and neck tape swing folder verified.'
  },
  {
    id: 'hc-4',
    category: 'attachments_jigs',
    item: 'Needle Plate, Feed Dog & Presser Foot Compatibility',
    standard: 'Needle hole clearance matches fabric weight (1.2mm for knit; 2.0mm for heavy denim); no burrs.',
    status: 'pass',
    responsible: 'Line Mechanic',
    notes: 'No snagging found on rib knit test strip.'
  },
  {
    id: 'hc-5',
    category: 'quality_sample',
    item: 'Golden / T.R. Sample Sign-Off with Tech Pack',
    standard: 'Line chief & QA approved golden sample pinned at head of line; critical specs within ±1/8" tolerance.',
    status: 'pass',
    responsible: 'Floor QA In-charge',
    notes: 'Signed and dated golden sample displayed at Station #1.'
  },
  {
    id: 'hc-6',
    category: 'quality_sample',
    item: 'SPI (Stitches Per Inch) & Seam Stretchability',
    standard: 'SPI conforms to buyer standard (12 SPI knit / 8 SPI denim); seam elongation minimum 80%.',
    status: 'pass',
    responsible: 'Quality Control Auditor',
    notes: 'Checked on calibrated 1-inch metal ruler.'
  },
  {
    id: 'hc-7',
    category: 'manpower_skill',
    item: 'Skill Matrix Mapping & Multi-Skill Floater',
    standard: 'Grade A operators assigned to critical bottleneck stations; 2 floaters assigned for morning warm-up.',
    status: 'pass',
    responsible: 'Line Supervisor & Line IE',
    notes: 'Operators #4 and #6 skill rating >92% verified.'
  },
  {
    id: 'hc-8',
    category: 'material_wip',
    item: 'Cutting Bundle Buffer & Shade Number Matching',
    standard: 'Minimum 50 garments cut bundle buffer staged at loading point; shade lots 100% matched.',
    status: 'pass',
    responsible: 'Feeding In-charge',
    notes: '3 full bundles staged at loading rack.'
  }
];

export const DEFAULT_HANDOFF_SIGNOFFS: LineHandoffSignoff[] = [
  {
    role: 'line_ie',
    title: 'Line Industrial Engineer',
    signedByName: 'Mahmudul Hoque, Sr. IE Executive',
    status: 'approved',
    signedAt: 'Today, 07:45 AM',
    comments: 'Pitch time balanced at 27.2s. Capacity calculated for 1,200 pcs target at 85% efficiency.'
  },
  {
    role: 'line_supervisor',
    title: 'Production Line Supervisor',
    signedByName: 'Rafiqul Islam, Sewing Supv.',
    status: 'approved',
    signedAt: 'Today, 07:55 AM',
    comments: 'All 36 operators seated; bundle tickets verified against style specification.'
  },
  {
    role: 'mechanic_foreman',
    title: 'Mechanical Maintenance In-charge',
    signedByName: 'Kabir Ahmed, Sr. Mechanic',
    status: 'approved',
    signedAt: 'Today, 07:30 AM',
    comments: 'Compressed air pressure 6.0 bar constant. All machines oiled and ground wiring checked.'
  },
  {
    role: 'qa_manager',
    title: 'Floor Quality Assurance Manager',
    signedByName: 'Nasreen Akter, Quality Lead',
    status: 'approved',
    signedAt: 'Today, 08:00 AM',
    comments: 'Trial run 5 pieces inspected with zero defects. Production cleared for full feed.'
  }
];

// Helper calculations
export function calculateSimulatorMetrics(params: {
  smvMinutes: number;
  operators: number;
  helpers: number;
  ironers: number;
  workingHours: number;
  targetEffPct: number;
  overtimeHours?: number;
}) {
  const { smvMinutes, operators, helpers, ironers, workingHours, targetEffPct, overtimeHours = 0 } = params;
  const totalManpower = operators + helpers + ironers;
  const grossWorkingHours = workingHours + overtimeHours;
  const workingMinutesPerOperator = grossWorkingHours * 60;
  const totalAvailableMinutes = totalManpower * workingMinutesPerOperator;

  // Theoretical Target Output = (Total Available Minutes * Target Efficiency %) / SMV
  const targetProductionPcs = smvMinutes > 0
    ? Math.round((totalAvailableMinutes * (targetEffPct / 100)) / smvMinutes)
    : 0;

  const targetHourlyRatePcs = grossWorkingHours > 0
    ? Math.round((targetProductionPcs / grossWorkingHours) * 10) / 10
    : 0;

  // Pitch Time (Takt Time) based strictly on operators = (SMV in minutes * 60) / operators (seconds)
  const pitchTimeSeconds = operators > 0
    ? Math.round(((smvMinutes * 60) / operators) * 10) / 10
    : 0;

  // Standard Allowed Hours produced at target
  const producedSAH = Math.round(((targetProductionPcs * smvMinutes) / 60) * 10) / 10;

  // Operator-to-Helper ratio
  const opHelperRatio = helpers > 0 ? (operators / helpers).toFixed(1) : `${operators}:0`;

  return {
    totalManpower,
    grossWorkingHours,
    workingMinutesPerOperator,
    totalAvailableMinutes,
    targetProductionPcs,
    targetHourlyRatePcs,
    pitchTimeSeconds,
    producedSAH,
    opHelperRatio
  };
}

export function calculatePitchAnalysis(operations: OperationStep[], pitchTimeSec: number) {
  let bottleneckCount = 0;
  let underloadedCount = 0;
  let totalCycleTimeSec = 0;
  let maxCycleTimeSec = 0;

  const analyzed = operations.map(op => {
    totalCycleTimeSec += op.cycleTimeSec;
    if (op.cycleTimeSec > maxCycleTimeSec) {
      maxCycleTimeSec = op.cycleTimeSec;
    }

    let status: 'ok' | 'bottleneck' | 'underloaded' = 'ok';
    if (op.cycleTimeSec > pitchTimeSec * 1.05) {
      status = 'bottleneck';
      bottleneckCount++;
    } else if (op.cycleTimeSec < pitchTimeSec * 0.75) {
      status = 'underloaded';
      underloadedCount++;
    }

    return {
      ...op,
      pitchStatus: status
    };
  });

  // Line Balance Efficiency % = (Sum of SMV / (Number of Workstations * Highest Cycle Time)) * 100
  const workstations = operations.length;
  const lineBalanceEfficiencyPct = workstations > 0 && maxCycleTimeSec > 0
    ? Math.round((totalCycleTimeSec / (workstations * maxCycleTimeSec)) * 1000) / 10
    : 0;

  const balanceLossPct = Math.max(0, Math.round((100 - lineBalanceEfficiencyPct) * 10) / 10);

  return {
    operations: analyzed,
    totalCycleTimeSec,
    maxCycleTimeSec,
    bottleneckCount,
    underloadedCount,
    lineBalanceEfficiencyPct,
    balanceLossPct
  };
}
