import { generateRecordId } from '../../common/services/keeper-data-bridge-client.js'

const baseViewModel = {
  pageTitle: 'Record ID Generator',
  heading: 'Record ID Generator',
  caption: 'Data Tools',
  breadcrumbs: [
    { text: 'Home', href: '/' },
    { text: 'Data Tools', href: '/data-tools/reference-data' },
    { text: 'Record ID Generator', href: '/data-tools/record-id-generator' }
  ]
}

export const recordIdGeneratorGetController = {
  handler(_request, h) {
    return h.view('data-tools/record-id-generator/index', {
      ...baseViewModel,
      generatedId: null,
      keyPartsUsed: null,
      keyPartsInput: '',
      error: null
    })
  }
}

export const recordIdGeneratorPostController = {
  async handler(request, h) {
    const { keyParts: rawInput = '' } = request.payload || {}

    const keyParts = rawInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    let generatedId = null
    let keyPartsUsed = null
    let error = null

    if (keyParts.length === 0) {
      error = 'Please provide at least one key part.'
    } else {
      try {
        const response = await generateRecordId(keyParts)
        generatedId = response.RecordId
        keyPartsUsed = response.KeyParts
      } catch (err) {
        error = `Failed to generate record ID: ${err.message}`
      }
    }

    return h.view('data-tools/record-id-generator/index', {
      ...baseViewModel,
      generatedId,
      keyPartsUsed,
      keyPartsInput: rawInput,
      error
    })
  }
}

export const recordIdGeneratorController = recordIdGeneratorGetController
