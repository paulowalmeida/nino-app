import { describe, expect, it } from 'vitest'

import {
  maskCnpj,
  maskCpf,
  maskPhone,
  maskTime,
  maskZipCode,
  onlyDigits,
} from './masks'

describe('masks', () => {
  it('onlyDigits strips every symbol a mask may have added', () => {
    // Arrange / Act
    const digits = onlyDigits('(11) 98765-4321')

    // Assert
    expect(digits).toBe('11987654321')
  })

  it('onlyDigits returns an empty string when there is no digit', () => {
    // Arrange / Act / Assert
    expect(onlyDigits('')).toBe('')
    expect(onlyDigits('abc-.,/')).toBe('')
  })

  it('maskPhone formats a mobile number', () => {
    // Arrange / Act / Assert
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('maskPhone formats a landline', () => {
    // Arrange / Act / Assert
    expect(maskPhone('1133224455')).toBe('(11) 3322-4455')
  })

  it('maskPhone keeps every partial length readable while typing', () => {
    // Arrange / Act / Assert
    expect(maskPhone('1')).toBe('1')
    expect(maskPhone('11')).toBe('11')
    expect(maskPhone('113')).toBe('(11) 3')
    expect(maskPhone('11332')).toBe('(11) 332')
    expect(maskPhone('113322')).toBe('(11) 3322')
    expect(maskPhone('1133224')).toBe('(11) 3322-4')
  })

  it('maskPhone moves the dash when the ninth digit arrives', () => {
    // Arrange
    const landline = '1133224455'
    const mobile = '11987654321'

    // Act / Assert
    expect(maskPhone(landline)).toBe('(11) 3322-4455')
    expect(maskPhone(mobile)).toBe('(11) 98765-4321')
  })

  it('maskPhone caps at 11 digits', () => {
    // Arrange / Act / Assert
    expect(maskPhone('119876543219999')).toBe('(11) 98765-4321')
  })

  it('maskPhone ignores what the person typed that is not a digit', () => {
    // Arrange / Act / Assert
    expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
    expect(maskPhone('abc')).toBe('')
  })

  it('maskCpf formats progressively', () => {
    // Arrange / Act / Assert
    expect(maskCpf('123')).toBe('123')
    expect(maskCpf('1234')).toBe('123.4')
    expect(maskCpf('123456')).toBe('123.456')
    expect(maskCpf('1234567')).toBe('123.456.7')
    expect(maskCpf('123456789')).toBe('123.456.789')
    expect(maskCpf('1234567890')).toBe('123.456.789-0')
    expect(maskCpf('12345678901')).toBe('123.456.789-01')
  })

  it('maskCpf caps at 11 digits', () => {
    // Arrange / Act / Assert
    expect(maskCpf('123456789019999')).toBe('123.456.789-01')
  })

  it('maskZipCode formats progressively and caps at 8 digits', () => {
    // Arrange / Act / Assert
    expect(maskZipCode('01310')).toBe('01310')
    expect(maskZipCode('013109')).toBe('01310-9')
    expect(maskZipCode('01310930')).toBe('01310-930')
    expect(maskZipCode('013109309999')).toBe('01310-930')
  })

  it('maskCnpj formats progressively and caps at 14 digits', () => {
    // Arrange / Act / Assert
    expect(maskCnpj('12')).toBe('12')
    expect(maskCnpj('123')).toBe('12.3')
    expect(maskCnpj('12345')).toBe('12.345')
    expect(maskCnpj('123456')).toBe('12.345.6')
    expect(maskCnpj('12345678')).toBe('12.345.678')
    expect(maskCnpj('123456780')).toBe('12.345.678/0')
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99')
    expect(maskCnpj('123456780001999999')).toBe('12.345.678/0001-99')
  })

  it('maskTime inserts the colon once the third digit arrives', () => {
    // Arrange / Act / Assert
    expect(maskTime('1')).toBe('1')
    expect(maskTime('14')).toBe('14')
    expect(maskTime('143')).toBe('14:3')
    expect(maskTime('1430')).toBe('14:30')
  })

  it('maskTime caps at 4 digits', () => {
    // Arrange / Act / Assert
    expect(maskTime('14309999')).toBe('14:30')
  })

  it('maskTime ignores what the person typed that is not a digit', () => {
    // Arrange / Act / Assert
    expect(maskTime('14:30')).toBe('14:30')
    expect(maskTime('abc')).toBe('')
  })

  it('every mask returns an empty string for an empty value', () => {
    // Arrange / Act / Assert
    expect(maskPhone('')).toBe('')
    expect(maskCpf('')).toBe('')
    expect(maskZipCode('')).toBe('')
    expect(maskCnpj('')).toBe('')
    expect(maskTime('')).toBe('')
  })
})
