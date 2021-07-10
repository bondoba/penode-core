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
    case(IdType.OWNER):
      boilerId = 'own-aaa-abbbb-abb-ba'
      break
    case(IdType.POT):
      boilerId = 'pot-ab-bbbab-bab-bb'
      break
    default:
      boilerId = 'bbaabbaa'
      break
  }
  const numRepId = boilerId.replace(/b/g, () => (Math.floor(Math.random() * 9) + 1).toString())
  const newId = numRepId.replace(/a/g, () => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
  return duplicateDbCheckMock(newId) !== 0 ? createId(type) : newId
}

function duplicateDbCheckMock(id: string): number {
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

enum PotType {
  CASH = 0,
  STOCKS,
  CRYPTO,
  CHEESE
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

abstract class Pot {
  private id: string
  private _ownerId: string
  private name?: string
  private type: PotType
  private isSubPot: boolean
  constructor(ownerId: string) {
    this.id = createId(IdType.POT)
    this._ownerId = ownerId
  }
}
