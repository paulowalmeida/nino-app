import { Box } from '@nino/ds/components/Box'

import { EmployeesContent } from './components/EmployeesContent/EmployeesContent'
import { EmployeesHeader } from './components/EmployeesHeader/EmployeesHeader'

import styles from './Employees.module.css'

export const Employees = () => {
  return (
    <Box className={styles.page}>
      <EmployeesHeader />
      <EmployeesContent />
    </Box>
  )
}
