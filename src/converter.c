#define STBI_ASSERT(x) // no assertion
#define STBI_NO_STDIO // no stdin/out
#define STBI_NO_THREAD_LOCALS // no bug with memory
#define STB_IMAGE_IMPLEMENTATION 
#include "stb_image.h"

#define STBI_WRITE_NO_STDIO
#define STBIW_ASSERT(x) 
#define STB_IMAGE_WRITE_IMPLEMENTATION 
#include "stb_image_write.h"


void* memset(void *b, int c, size_t len)
{
    int           i;
    unsigned char *p = b;
    i = 0;
    while(len > 0)
    {
        *p = c;
        p++;
        len--;
    }
    return(b);
}

#define STBIR_ASSERT(x) 
#define STBI_RESIZE_NO_STDIO
#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "stb_image_resize.h"

#include <webassembly.h>


typedef struct {
    int last_pos;
    void *context;
} custom_stbi_mem_context;


// custom write function
static void custom_stbi_write_mem(void *context, void *data, int size) {
   custom_stbi_mem_context *c = (custom_stbi_mem_context*)context; 
   char *dst = (char *)c->context;
   char *src = (char *)data;
   int cur_pos = c->last_pos;
   for (int i = 0; i < size; i++) {
       dst[cur_pos++] = src[i];
   }
   c->last_pos = cur_pos;
}


export size_t convert_file(unsigned char* location, size_t size, unsigned char* destination, float quality) {
    int q = (quality*100)+1;

    //                        _     _           _            
    // __ ___ _ ___ _____ _ _| |_  | |_ ___    (_)_ __  __ _ 
    /// _/ _ \ ' \ V / -_) '_|  _| |  _/ _ \   | | '_ \/ _` |
    //\__\___/_||_\_/\___|_|  \__|  \__\___/  _/ | .__/\__, |
    //                                       |__/|_|   |___/ 

    int width = 0, height = 0, channels = 0;
    unsigned char* img = stbi_load_from_memory(location, size, &width, &height, &channels, 0);
    if (img==0) { return 0; /* catch error */}

    // reserve size for resizing
    unsigned char* img2 = malloc(width*height*channels);

    // resize image (2 times less wide/heigh)
    int new_width = width/2;
    int new_height = height/2;
    stbir_resize_uint8(img,  width,     height,     0,
                       img2, new_width, new_height, 0, channels);


    // write to jpeg
    custom_stbi_mem_context context;
    context.last_pos = 0;
    context.context = destination;

    stbi_write_jpg_to_func(custom_stbi_write_mem, &context, new_width, new_height, channels, img2, q);
    stbi_image_free(img); 
    stbi_image_free(img2); 

    return context.last_pos;
}


export void* __malloc(size_t size){
    return malloc(size);
}
