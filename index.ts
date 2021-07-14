/*
*   penode-core, a system to manage portfolios and pots of (retirement) savings
*   Copyright (C) 2021  Bala Bondo and contributors
*
*   This program is free software; you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation; either version 2 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License along
*   with this program; if not, write to the Free Software Foundation, Inc.,
*   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

function createId(type: IdType): string {
  let boilerId: string
  switch(type) {
    default:
    case(IdType.OWNER):
      boilerId = 'own-aaa-abbbb-abb-ba'
      break
    case(IdType.POT):
      boilerId = 'pot-ab-bbbab-bab-bb'
      break
  }
  const numRepId = boilerId.replace(/b/g, () => (Math.floor(Math.random() * 9) + 1).toString())
  const newId = numRepId.replace(/a/g, () => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
  return duplicateDbCheckMock(newId, type) !== 0 ? createId(type) : newId
}

function duplicateDbCheckMock(id: string, type: IdType): number {
  const idToCheck = new String(id)
  idToCheck.toLowerCase()
  return Math.floor(Math.random() * 2)
}

enum IdType {
  OWNER = 0,
  POT
}

enum OwnerType {
  PLACEHOLDER_A = 0,
  PLACEHOLDER_B,
  PLACEHOLDER_C
}

enum ContentType {
  CASH = 'cash',
  STOCKS = 'stocks'
}

enum ContentUnit {
  PIECES = 'pcs',
  GRAMS = 'gr',
  DECIMALNUMBER = 'numeric'
}

enum CurrencySym {
  USD = 'USD',
  CAD = 'CAD',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD'
}

class Owner {
  private id: string
  private _potIds: string[]
  private name?: string
  private ownerTypes?: OwnerType[]
  constructor() {
    this.id = createId(IdType.OWNER)
    this._potIds = []
  }
}

type PotContent = {
  kind: ContentType
  unit: ContentUnit
  quantity: number
}

abstract class Pot {
  private id: string
  private _ownerId: string
  private displayCurrency: CurrencySym
  private isSubPot: boolean
  protected contents: PotContent[]
  private name?: string
  private _supPotId?: string
  constructor(ownerId: string, displayCurrency: CurrencySym = CurrencySym.USD, isSubPot: boolean = false, supPotId: string = null) {
    this.id = createId(IdType.POT)
    this._ownerId = ownerId
    this.isSubPot = isSubPot
    if (isSubPot) this._supPotId = supPotId
    this.contents = []
  }
  setName(newName: string): void {
    this.name = newName
  }
  abstract validateNewContent(newContent: PotContent): boolean
}

class CashPot extends Pot {
  validateNewContent(newContent: PotContent): boolean {
    if (newContent.kind !== ContentType.CASH && newContent.quantity <= 0 && newContent.unit !== ContentUnit.DECIMALNUMBER) {
      return false
    } else {
      this.contents.push(newContent)
      return true
    }
  }
}
