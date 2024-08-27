// const forms = {
//   '9mobile'
// const { forms } = require("./messageFunctions/botfunction")

const { forms } = require("./messageFunctions/botfunction");

// : {
//     Value: "3",
//     Service_Type: "CG",
//     Data_Plan: [
//       {
//         Value: "358", InnerText: "15.0GB ₦1995.0 for 30days"
//       },
//       {
//         Value: "287", InnerText: "1.0GB ₦133.0 for 30days"
//       },
//       {
//         Value: "291", InnerText: "3.0GB ₦399.0 for 30days"
//       },
//       {
//         Value: "382", InnerText: "11.0GB ₦1463.0 for 30days"
//       },
//       {
//         Value: "357", InnerText: "100.0MB ₦15.13 for 30days"
//       },
//       {
//         Value: "286", InnerText: "1.5GB ₦199.5 for 30days"
//       },
//       {
//         Value: "361", InnerText: "25.0GB ₦3325.0 for 30days"
//       },
//       {
//         Value: "290", InnerText: "10.0GB ₦1330.0 for 30days"
//       },
//       {
//         Value: "381", InnerText: "4.5GB ₦598.5 for 30days"
//       },
//       {
//         Value: "360", InnerText: "30.0GB ₦3990.0 for 30days"
//       },
//       {
//         Value: "289", InnerText: "5.0GB ₦665.0 for 30days"
//       },
//       {
//         Value: "365", InnerText: "1.0MB ₦9.31 for 30days"
//       },
//       {
//         Value: "356", InnerText: "300.0MB ₦44.83 for 30days"
//       },
//       {
//         Value: "389", InnerText: "25.0MB ₦33.75 for 30days"
//       },
//       {
//         Value: "359", InnerText: "20.0GB ₦2660.0 for 30days"
//       },
//       {
//         Value: "288", InnerText: "2.0GB ₦266.0 for 30days"
//       },
//       {
//         Value: "363", InnerText: "7.5GB ₦997.5 for 30days"
//       },
//       {
//         Value: "334", InnerText: "500.0MB ₦66.5 for 30days"
//       },
//       {
//         Value: "388", InnerText: "4.0GB ₦532.0 for 30days"
//       }
//     ]
//   },
//   airtel: {
//     Value: "4",
//     Service_Type: "CG",
//     Data_Plan: [
//       {
//         Value: "225", InnerText: "1.0GB ₦275.02 for 1 month (CG - 1GB)"
//       },
//       {
//         Value: "230", InnerText: "500.0MB ₦137.76 for 1 month (CG - 500MB)"
//       },
//       {
//         Value: "262", InnerText: "300.0MB ₦82.81 for 7days (CG - 300MB)"
//       },
//       {
//         Value: "228", InnerText: "100.0MB ₦27.8 for 7days (CG - 100MB)"
//       },
//       {
//         Value: "261", InnerText: "20.0GB ₦5500.33 for 1 month (CG - 20GB)"
//       },
//       {
//         Value: "227", InnerText: "5.0GB ₦1375.08 for 1 month (CG - 5GB)"
//       },
//       {
//         Value: "260", InnerText: "15.0GB ₦4125.25 for 1 month (CG - 15GB)"
//       },
//       {
//         Value: "226", InnerText: "2.0GB ₦550.03 for 1 month (CG - 2GB)"
//       },
//       {
//         Value: "250", InnerText: "10.0GB ₦2750.17 for 1 month (CG - 10GB)"
//       },
//     ]
//   },
//   glo: {
//     Value: "2",
//     Service_Type: "CG",
//     Data_Plan: [
//       {
//         Value: "323", InnerText: "1.0GB ₦270.25 for 1 month (CG - 1024MB)"
//       },
//       {
//         Value: "327", InnerText: "10.0GB ₦2702.5 for 1 month (CG - 10240MB)"
//       },
//       {
//         Value: "322", InnerText: "500.0MB ₦135.7 for 1 month (CG - 500MB)"
//       },
//       {
//         Value: "326", InnerText: "5.0GB ₦1351.24 for 1 month (CG - 5120MB)"
//       },
//       {
//         Value: "325", InnerText: "3.0GB ₦810.75 for 1 month (CG - 3072MB)"
//       },
//       {
//         Value: "324", InnerText: "2.0GB ₦540.5 for 1 month (CG - 2048MB)"
//       },
//       {
//         Value: "330", InnerText: "200.0MB ₦67.56 for 14days (CG - 200MB)"
//       }
//     ]
//   },
//   MTN: {
//     MTN_CG1: {
//       Value: "1",
//       Service_Type: "CG1",
//       Data_Plan: [
//         {
//           Value: "216",
//           InnerText: "40.0GB ₦10563.78 for 1 month (CG1 - 40960MB)"
//         },
//         {
//           Value: "234",
//           InnerText: "50.0MB ₦13.72 for 1 month (CG1- 50MB)"
//         },
//         {
//           Value: "212",
//           InnerText: "5.0GB ₦1320.47 for 1 month (CG1 - 5120MB)"
//         },
//         {
//           Value: "232",
//           InnerText: "250.0MB ₦66.54 for 1 month (CG1 - 250MB)"
//         },
//         {
//           Value: "211",
//           InnerText: "3.0GB ₦792.28 for 1 month (CG1 - 3072MB)"
//         },
//         {
//           Value: "231",
//           InnerText: "500.0MB ₦132.3 for 1 month (CG1 - 500MB)"
//         },
//         {
//           Value: "210",
//           InnerText: "2.0GB ₦528.19 for 1 month (CG1 - 2048MB)"
//         },
//         {
//           Value: "214",
//           InnerText: "15.0GB ₦3961.42 for 1 month (CG1 - 15360MB)"
//         },
//         {
//           Value: "314",
//           InnerText: "25.0GB ₦6602.36 for 1 month (CG1 - 25600MB)"
//         },
//         {
//           Value: "207",
//           InnerText: "1.0GB ₦264.09 for 1 month (CG1 - 1024MB)"
//         },
//         {
//           Value: "251",
//           InnerText: "150.0MB ₦40.13 for 1 month (CG1 - 150MB)"
//         },
//         {
//           Value: "213",
//           InnerText: "10.0GB ₦2640.94 for 1 month (CG1 - 10240MB)"
//         },
//         {
//           Value: "313",
//           InnerText: "12.0GB ₦3169.13 for 1 month (CG1 - 12288MB)"
//         },
//       ]
//     },
//     MTN_CG2: {
//       Value: "1",
//       Service_Type: "CG2",
//       Data_Plan: [
//         {
//           Value: "374",
//           InnerText: "50.0MB ₦15.06 for 30days"
//         },
//         {
//           Value: "297",
//           InnerText: "6.0GB ₦1560.0 for 1 month (CG2 - 6000MB)"
//         },
//         {
//           Value: "293",
//           InnerText: "2.0GB ₦520.0 for 1 month (CG2 - 2000MB)"
//         },
//         {
//           Value: "312",
//           InnerText: "4.5GB ₦1170.0 for 1 month (CG2 - 4500MB)"
//         },
//         {
//           Value: "301",
//           InnerText: "10.0GB ₦2600.0 for 1 month (CG2 - 10000MB)"
//         },
//         {
//           Value: "328",
//           InnerText: "500.0MB ₦130.51 for 1 month (CG2 - 500MB)"
//         },
//         {
//           Value: "296",
//           InnerText: "5.0GB ₦1300.0 for 1 month (CG2 - 5000MB)"
//         },
//         {
//           Value: "292",
//           InnerText: "1.0GB ₦260.0 for 1 month (CG2 - 1000MB)"
//         },
//         {
//           Value: "311",
//           InnerText: "1.5GB ₦390.0 for 1 month (CG2 - 1500MB)"
//         },
//         {
//           Value: "300",
//           InnerText: "9.0GB ₦2340.0 for 1 month (CG2 - 9000MB)"
//         },
//         {
//           Value: "333",
//           InnerText: "250.0MB ₦66.54 for 1 month (CG2 - 250MB)"
//         },
//         {
//           Value: "377",
//           InnerText: "20.0MB ₦6.74 for 1 month (CG2 - 20MB)"
//         },
//         {
//           Value: "295",
//           InnerText: "4.0GB ₦1040.0 for 1 month (CG2 - 4000MB)"
//         },
//         {
//           Value: "299",
//           InnerText: "8.0GB ₦2080.0 for 1 month (CG2 - 8000MB)"
//         },
//         {
//           Value: "303",
//           InnerText: "20.0GB ₦5200.0 for 1 month (CG2 - 20000MB)"
//         },
//         {
//           Value: "309",
//           InnerText: "300.0MB ₦79.02 for 1 month (CG2 - 300MB)"
//         },
//         {
//           Value: "376",
//           InnerText: "25.0MB ₦8.04 for 1 month (CG2 - 25MB)"
//         },
//         {
//           Value: "294",
//           InnerText: "3.0GB ₦780.0 for 1 month (CG2 - 3000MB)"
//         },
//         {
//           Value: "298",
//           InnerText: "7.0GB ₦1820.0 for 1 month (CG2 - 7000MB)"
//         },
//         {
//           Value: "302",
//           InnerText: "15.0GB ₦3900.0 for 1 month (CG2 - 15000MB)"
//         },
//         {
//           Value: "308",
//           InnerText: "100.0MB ₦27.54 for 1 month (CG2 - 100MB)"
//         },
//         {
//           Value: "329",
//           InnerText: "150.0MB ₦40.54 for 1 month (CG2 - 150MB)"
//         }
//       ]
//     },
//     MTN_GIFTING: {
//       Value: "1",
//       Service_Type: "GIFTING",
//       Data_Plan: [
//         {
//           Value: "398",
//           InnerText: "2.0GB ₦490.0 for 30days"
//         },
//         {
//           Value: "402",
//           InnerText: "500.0MB ₦122.5 for 30days"
//         },
//         {
//           Value: "397",
//           InnerText: "1.0GB ₦245.0 for 30days"
//         },
//         {
//           Value: "401",
//           InnerText: "5.0GB ₦1225.0 for 30days"
//         },
//         {
//           Value: "399",
//           InnerText: "3.0GB ₦735.0 for 30days"
//         }
//       ]
//     },
//     MTN_SME: {
//       Value: "1",
//       Service_Type: "SME",
//       Data_Plan: [
//         {
//           Value: "7",
//           InnerText: "1.0GB ₦260.0 for 30days"
//         },
//         {
//           Value: "44",
//           InnerText: "3.0GB ₦780.0 for 30days"
//         },
//         {
//           Value: "6",
//           InnerText: "500.0MB ₦130.0 for 30days"
//         },
//         {
//           Value: "43",
//           InnerText: "10.0GB ₦2600.0 for 30days"
//         },
//         {
//           Value: "11",
//           InnerText: "5.0GB ₦1300.0 for 30days"
//         },
//         {
//           Value: "8",
//           InnerText: "2.0GB ₦520.0 for 30days"
//         }
//       ]
//     }
//   },
//};

function extractDataAmount(innerText) {
    const regex1 = /(\d+[.]+\d+GB|\d+[.]+\d+MB)/;
    const regex2 = /(\d+GB|\d+MB)/;
    const match = innerText.match(regex1) || innerText.match(regex2);
    return match ? match[0] : null;
}

function extractNairaAmount(innerText) {
  const regex = /₦([\d,]+)/;
  const match = innerText.match(regex);
  console.log(match)
        
  return match ? match[1].replace(/,/g, '') : null;
}
function findServicePlanText(value, network_id) {
    if (network_id==='1') {
        const f = forms.mtn;
        
        for (const form in f) {
            if (form === 'Value') {
                continue;
            }
            const plans = f[form].Data_Plan;
            for (const plan of plans) {
                if (plan.Value === value.toString()) {
                return plan.InnerText;
                }
            }
        }
        return null
    } else {
        for (const form in forms) {
            const plans = forms[form].Data_Plan;
            for (const plan of plans) {
                if (plan.Value === value.toString()) {
                    return plan.InnerText;
                }
            }
        }
        return null;
    }
}
console.log(extractDataAmount('02.00GB ₦520.0 for 30days'))

