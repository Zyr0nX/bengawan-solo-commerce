import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";
import { UpdateStrapiService } from "medusa-plugin-strapi-ts/dist/services/update-strapi";

export default class StrapiService extends TransactionBaseService {
  protected readonly updateStrapiService_: UpdateStrapiService;

  constructor({
    updateStrapiService,
  }: {
    updateStrapiService: UpdateStrapiService;
  }) {
    // @ts-ignore
    super(...arguments);

    this.updateStrapiService_ = updateStrapiService;
  }

  async startStrapiService(): Promise<unknown> {
    return await this.updateStrapiService_.startInterface();
  }
}
