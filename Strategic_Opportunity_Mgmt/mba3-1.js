const employees = require('./current_employees.json');

function logPercent(str, num, total) {
    return `* ${str}: ${num}/${total} ${(num / total) * 100}`
}

function logEmployee(employee = {}) {
    console.log(`Employee No. ${employee.EmployeeNo}: predicted years - former: ${employee.perdictFormerYears} | current: ${employee.perdictCurrentYears}`)
    console.log(`\tYearsAtCompany: ${employee.YearsAtCompany}`)
    console.log(`\tYearsInRole: ${employee.YearsInCurrentRole}`)
    console.log(`\tYearsSinceLastPromotion: ${employee.YearsSinceLastPromotion}`)
    console.log(`\tTotalWorkingYears: ${employee.TotalWorkingYears}`)
    console.log(`\tYearly Income: $${(employee.MonthlyIncome * 12).toLocaleString("en-US")}`)
    console.log(`\tAge: ${employee.Age}`)
}

function calculateSad(employee = {}) {
    const Intercept = 0.783023583
    const YearsInCurrentRoleCo = 0.77320369
    const YearsSinceLastPromotionCo = 0.364500678
    const TotalWorkingYearsCo = 0.115365639
    employee.perdictFormerYears = Intercept
        + (YearsInCurrentRoleCo * employee.YearsInCurrentRole)
        + (YearsSinceLastPromotionCo * employee.YearsSinceLastPromotion)
        + (TotalWorkingYearsCo * employee.TotalWorkingYears)
    return employee.perdictFormerYears
}

function calculateHappy(employee = {}) {
    const Intercept = 2.50195492
    const AgeCo = -0.059787525
    const TotalWorkingYearsCo = 0.160383226
    const YearsInCurrentRoleCo = 0.843540394
    const YearsSinceLastPromotionCo = 0.309340252
    const MonthlyIncomeCo = 5.7086E-05

    employee.perdictCurrentYears = Intercept
        + (AgeCo * employee.Age)
        + (MonthlyIncomeCo * employee.MonthlyIncome)
        + (YearsInCurrentRoleCo * employee.YearsInCurrentRole)
        + (YearsSinceLastPromotionCo * employee.YearsSinceLastPromotion)
        + (TotalWorkingYearsCo * employee.TotalWorkingYears)
    return employee.perdictCurrentYears
}


function leavingPpl() {
    let numTemptedLeaving = 0
    let notHappy = 0
    let numCannotBeBought = 0
    employees.forEach(employee => {
        if (employee.YearsAtCompany > calculateSad(employee)) {
            numTemptedLeaving += 1

            if (employee.YearsAtCompany !== Math.round(calculateHappy(employee))) {
                notHappy += 1
                const adjustedEmployee = { ...employee }
                adjustedEmployee.MonthlyIncome = adjustedEmployee.MonthlyIncome + 1000
                //adjustedEmployee.YearsSinceLastPromotion = 0
                if (adjustedEmployee.YearsAtCompany > calculateHappy(adjustedEmployee)) {
                    numCannotBeBought += 1
                    logEmployee(adjustedEmployee)
                }
            }
        }
    })

    console.warn(`
    ${logPercent('Tempted to leave', numTemptedLeaving, employees.length)}
    ${logPercent('Not happy', notHappy, employees.length)}
    ${logPercent('Can be bought', notHappy - numCannotBeBought, notHappy)}
    `)
}

leavingPpl()
